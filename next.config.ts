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
  // output: "dist",
  // distDir: "dist",
};

export default nextConfig;
