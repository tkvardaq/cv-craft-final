import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CvCRAFT | The Royal Standard of AI Resumes",
  description: "Craft a professional CV that beats the ATS and lands you your dream job with AI-powered keyword optimization and premium designs.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-slate-900">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
