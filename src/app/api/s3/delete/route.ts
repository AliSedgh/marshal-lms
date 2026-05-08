import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  const decision = await aj.protect(request, {
    fingerprints: session?.user?.id!,
  });

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "You are not authorized to delete files" },
      { status: 409 },
    );
  }

  try {
    const body = (await request.json()) as { key: string };
    const { key } = body;
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }
    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: key,
    });
    await S3.send(command);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
