import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in or create your account",
  description:
    "Sign in to CvCRAFT or create a free account to build an ATS-optimised CV with AI tailoring and premium templates.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
