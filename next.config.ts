import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js badge in development so it doesn't cover the page in previews.
  devIndicators: false,
};

export default nextConfig;
