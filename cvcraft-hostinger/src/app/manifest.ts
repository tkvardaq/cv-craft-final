import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CvCRAFT — AI-Powered CV Builder",
    short_name: "CvCRAFT",
    description:
      "Craft a professional, ATS-optimised CV with AI keyword tailoring and premium UK-ready designs.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a1128",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
