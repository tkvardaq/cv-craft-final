import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-100 shadow-xl p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-royal-gold mb-3">404</p>
        <h1 className="text-2xl font-bold text-royal-navy mb-3">Page not found</h1>
        <p className="text-sm text-slate-600 mb-8">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex w-full items-center justify-center rounded-xl bg-royal-navy px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
