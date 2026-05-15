import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-100 shadow-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-royal-navy mb-3">Sign-in link expired</h1>
        <p className="text-sm text-slate-600 mb-8">
          The authentication link could not be verified. Please request a fresh sign-in link and try again.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex w-full items-center justify-center rounded-xl bg-royal-navy px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}
