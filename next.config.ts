import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEPLOYMENT_TIME: new Date().toISOString(),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
