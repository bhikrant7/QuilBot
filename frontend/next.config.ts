import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // .next/standalone folder that our Dockerfile needs.
  output: 'standalone',
};

export default nextConfig;
