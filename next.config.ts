import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eslint: {
    ignoreDuringBuilds: true,
  } as any,
};

export default nextConfig;
