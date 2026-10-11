import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Allow build to succeed even with TS errors during phase 1
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
