import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@react-pdf/renderer", "pdf-parse"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
