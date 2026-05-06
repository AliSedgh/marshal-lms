import { env } from "@/lib/env";

const useConstructUrl = (key: string) => {
  return `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.tigrisfiles.io/${key}`;
};

export default useConstructUrl;
