import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import z from "zod";
import { S3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const decision = await aj.protect(request, {
    fingerprints: session?.user?.id!,
  });

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "You are not authorized to upload files" },
      { status: 409 },
    );
  }

  try {
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;
    // Presigned browser PUT: do not use ChecksumAlgorithm — the SDK adds checksum
    // query params that XHR/fetch from the browser cannot satisfy → 403 AccessDenied.
    // Omit ACL here if the bucket uses "Bucket owner enforced" or policy-based public
    // read; use a bucket policy instead of object ACLs.
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    // @aws-sdk/s3-request-presigner adds `content-type` to unsignableHeaders by default.
    // Browsers still send Content-Type on PUT → Tigris/S3-compatible may respond 403.
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
      signableHeaders: new Set(["content-type", "host"]),
    });
    const response = {
      presignedUrl,
      key: uniqueKey,
      contentType,
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate preSigned Url",
      },
      { status: 500 },
    );
  }
}
