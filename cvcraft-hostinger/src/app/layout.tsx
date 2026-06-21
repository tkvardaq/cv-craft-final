import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CvCRAFT | AI-Powered CV Builder for the UK",
    template: "%s | CvCRAFT",
  },
  description:
    "Craft a professional, ATS-optimised CV with AI keyword tailoring and premium UK-ready designs. Land more interviews.",
  keywords: [
    "CV builder",
    "resume builder",
    "ATS CV",
    "UK CV",
    "AI CV",
    "professional CV",
    "job application",
  ],
  applicationName: "CvCRAFT",
  authors: [{ name: "CvCRAFT" }],
  creator: "CvCRAFT",
  publisher: "CvCRAFT",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "CvCRAFT",
    title: "CvCRAFT | AI-Powered CV Builder for the UK",
    description:
      "Craft a professional, ATS-optimised CV with AI keyword tailoring and premium UK-ready designs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CvCRAFT — AI-Powered CV Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CvCRAFT | AI-Powered CV Builder",
    description:
      "ATS-optimised CVs with AI keyword tailoring and premium UK-ready designs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1128" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-slate-900">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
