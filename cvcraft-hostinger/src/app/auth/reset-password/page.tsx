"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, ArrowRight, Check, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { updatePassword } from "../actions";

function checks(pw: string) {
  return [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "One number", ok: /\d/.test(pw) },
    { label: "One symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reqs = useMemo(() => checks(password), [password]);
  const allOk = reqs.every((c) => c.ok);
  const match = password.length > 0 && password === confirm;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!allOk) {
      setError("Please meet all password requirements.");
      return;
    }
    if (!match) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.set("password", password);
    const result = await updatePassword(fd);
    if (result && "error" in result && result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight uppercase text-royal-navy">
            CvCRAFT<span className="text-royal-gold">.</span>
          </span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <h1 className="text-2xl font-black tracking-tight text-royal-navy mb-2">Set a new password</h1>
          <p className="text-sm text-slate-500 mb-6">Choose a strong password you haven&apos;t used before.</p>

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-royal-navy"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <ul className="mt-3 grid grid-cols-2 gap-1.5">
                  {reqs.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center gap-1.5 text-[11px] font-medium ${c.ok ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20"
                placeholder="Re-enter your password"
                required
              />
              {confirm.length > 0 && !match && (
                <p className="mt-1.5 text-xs font-medium text-red-600">Passwords do not match.</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-royal-navy py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-royal-navy/10 hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Update password
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/auth/login" className="font-bold text-royal-navy hover:text-royal-gold">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
