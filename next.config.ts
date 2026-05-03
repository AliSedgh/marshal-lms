import { env } from "@/lib/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [env.NEXT_PUBLIC_AWS_BUCKET_NAME + ".t3.tigrisfiles.io"],
  },
};

export default nextConfig;
