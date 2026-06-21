"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-100 shadow-xl p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-royal-navy mb-3">Something went wrong</h1>
        <p className="text-sm text-slate-600 mb-8">
          The page could not finish loading. Try again, and if it keeps happening, check the server logs.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex w-full items-center justify-center rounded-xl bg-royal-navy px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
