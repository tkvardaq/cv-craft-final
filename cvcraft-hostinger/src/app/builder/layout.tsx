import { Metadata } from "next";
import { CvStoreHydrator } from "@/lib/store/hydrate";

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Create and edit your professional CV.",
  robots: { index: false, follow: false },
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The builder page renders its own Header (with user context + back button)
  // and page chrome. The layout only needs to rehydrate the Zustand store.
  return (
    <>
      <CvStoreHydrator />
      {children}
    </>
  );
}
