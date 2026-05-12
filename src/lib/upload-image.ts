import { env } from "@/lib/env";

export function getPublicObjectUrl(key: string) {
  return `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.tigrisfiles.io/${key}`;
}

export async function uploadImageToS3(file: File): Promise<string> {
  const res = await fetch("/api/s3/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      isImage: true,
    }),
  });
  if (!res.ok) {
    let message = "Failed to get upload URL";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const { presignedUrl, key, contentType } = (await res.json()) as {
    presignedUrl: string;
    key: string;
    contentType: string;
  };
  const put = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType || file.type || "application/octet-stream",
    },
    body: file,
  });
  if (!put.ok) {
    throw new Error("Upload failed");
  }
  return getPublicObjectUrl(key);
}
