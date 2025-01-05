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
  output: 'export',
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? 'kaminzhi.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kaminzhi.github.io/' : '',
};

export default nextConfig;
