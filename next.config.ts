import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/gallery", destination: "/photos", permanent: true }];
  },
};

export default nextConfig;
