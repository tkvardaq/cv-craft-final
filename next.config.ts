import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@react-pdf/renderer", "pdf-parse"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
