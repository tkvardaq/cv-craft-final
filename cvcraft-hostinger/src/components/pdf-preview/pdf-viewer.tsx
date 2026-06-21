"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useCvStore } from "@/lib/store/cv-store";
import type { CV } from "@/lib/schemas/cv";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <PDFSkeleton /> }
);

const CVDocumentLazy = dynamic(
  () =>
    import("@/lib/pdf/cv-document").then((mod) => ({
      default: mod.CVDocument,
    })),
  { ssr: false }
);

function PDFSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[600px] h-full bg-slate-50 rounded-xl">
      <div className="text-center space-y-3">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-slate-500">Loading preview…</p>
      </div>
    </div>
  );
}

export function PDFPreview({ cv: propCv }: { cv?: CV }) {
  const storeCv = useCvStore((s) => s.cv);
  const isPremium = useCvStore((s) => s.isPremium);
  const templateId = useCvStore((s) => s.selectedTemplate);

  const cv = propCv || storeCv;
  const serializedCv = JSON.stringify(cv);
  const [debouncedSerializedCv, setDebouncedSerializedCv] = useState(serializedCv);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSerializedCv(serializedCv);
    }, 800);
    return () => clearTimeout(timer);
  }, [serializedCv]);

  const memoizedCv = useMemo<CV>(
    () => JSON.parse(debouncedSerializedCv) as CV,
    [debouncedSerializedCv]
  );

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-inner min-h-[600px]">
      <PDFViewer
        width="100%"
        height="100%"
        showToolbar={false}
        style={{ border: "none" }}
      >
        <CVDocumentLazy cv={memoizedCv} isPremium={isPremium} templateId={templateId} />
      </PDFViewer>
    </div>
  );
}
