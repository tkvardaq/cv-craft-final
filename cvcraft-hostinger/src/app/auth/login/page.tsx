"use client";

import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup, requestPasswordReset } from "../actions";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  Star,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const OAUTH_GOOGLE_ENABLED = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED === "true";
const OAUTH_AZURE_ENABLED = process.env.NEXT_PUBLIC_OAUTH_AZURE_ENABLED === "true";
const ANY_OAUTH_ENABLED = OAUTH_GOOGLE_ENABLED || OAUTH_AZURE_ENABLED;

type Mode = "signin" | "signup" | "forgot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordChecks(pw: string) {
  return [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "One number", ok: /\d/.test(pw) },
    { label: "One symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

function strengthMeta(checks: { ok: boolean }[]) {
  const score = checks.filter((c) => c.ok).length;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
}

function LoginContent() {
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean }>({});

  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const checks = useMemo(() => passwordChecks(password), [password]);
  const strength = useMemo(() => strengthMeta(checks), [checks]);
  const emailValid = EMAIL_RE.test(email);
  const emailError = touched.email && email.length > 0 && !emailValid;

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setMessage(null);
    setPassword("");
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!emailValid) {
      setTouched({ email: true });
      setError("Please enter a valid email address.");
      return;
    }
    if (isSignup) {
      const failing = checks.find((c) => !c.ok);
      if (failing) {
        setError(`Password needs: ${checks.filter((c) => !c.ok).map((c) => c.label.toLowerCase()).join(", ")}.`);
        return;
      }
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = isForgot
      ? await requestPasswordReset(formData)
      : isSignup
        ? await signup(formData)
        : await login(formData);

    if (result && "error" in result && result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
    if (result && "message" in result && result.message) {
      setMessage(result.message);
      setIsLoading(false);
      if (isSignup) setMode("signin");
    }
  };

  const handleOAuthLogin = async (provider: "google" | "azure") => {
    try {
      setOauthLoading(provider);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setOauthLoading(null);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("provider is not enabled") || msg.toLowerCase().includes("validation_failed")) {
        toast.error("Social sign-in is coming soon. Please use email and password for now.");
      } else {
        toast.error(msg);
      }
    }
  };

  const heading = isForgot
    ? "Reset your password"
    : isSignup
      ? "Create your free account"
      : "Welcome back";
  const subheading = isForgot
    ? "Enter your email and we'll send you a secure reset link."
    : isSignup
      ? "Build a recruiter-ready CV in minutes — no card required."
      : "Sign in to continue building your CV.";

  return (
    <div className="min-h-screen bg-ivory font-sans">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Branding panel */}
        <aside className="hidden lg:flex flex-col justify-between bg-royal-navy text-white p-12 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-royal-gold/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-royal-gold/5 blur-3xl" />

          <Link href="/" className="flex items-center gap-3 relative z-10 group w-fit">
            <div className="p-2 rounded-xl bg-royal-gold group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-royal-navy" />
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">
              CvCRAFT<span className="text-royal-gold">.</span>
            </span>
          </Link>

          <div className="relative z-10 space-y-10">
            <div>
              <span className="inline-block text-[10px] font-black tracking-[0.4em] uppercase text-royal-gold mb-4">
                Trusted by 25,000+ professionals
              </span>
              <h1 className="text-4xl xl:text-5xl font-black tracking-tighter leading-[1.05] mb-6">
                Craft a CV that beats the ATS — and lands the interview.
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                AI keyword tailoring, recruiter-tested templates, and a one-click PDF that ships looking exactly as designed.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                { icon: Sparkles, text: "AI bullet rewriting in STAR format" },
                { icon: Shield, text: "99.4% ATS pass rate across recruiter tools" },
                { icon: Check, text: "10+ designs handcrafted for UK & global hiring" },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    <f.icon className="h-4 w-4 text-royal-gold" />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={`s-${i}`} className="h-3.5 w-3.5 fill-royal-gold text-royal-gold" />
                ))}
              </div>
              <p className="text-sm text-white/80 italic leading-relaxed mb-4">
                &ldquo;Three interview invitations in the first week. The AI rewriter genuinely understood my role.&rdquo;
              </p>
              <div className="text-xs font-bold tracking-widest uppercase text-white/60">
                Sarah J. · Product Manager
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
            © {new Date().getFullYear()} CvCRAFT
          </p>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="lg:hidden mb-8 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase text-royal-navy">
                CvCRAFT<span className="text-royal-gold">.</span>
              </span>
            </Link>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="mb-7">
              <h2 className="text-3xl font-black tracking-tight text-royal-navy mb-2">{heading}</h2>
              <p className="text-slate-500">{subheading}</p>
            </div>

            {/* Tab switcher (hidden in forgot mode) */}
            {!isForgot && (
              <div className="mb-7 grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={!isSignup}
                  onClick={() => switchMode("signin")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    !isSignup ? "bg-white text-royal-navy shadow-sm" : "text-slate-500 hover:text-royal-navy"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSignup}
                  onClick={() => switchMode("signup")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isSignup ? "bg-white text-royal-navy shadow-sm" : "text-slate-500 hover:text-royal-navy"
                  }`}
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Social — placed above the form, Google/Facebook style */}
            {!isForgot && ANY_OAUTH_ENABLED && (
              <>
                <div className={`grid gap-3 mb-6 ${OAUTH_GOOGLE_ENABLED && OAUTH_AZURE_ENABLED ? "grid-cols-2" : "grid-cols-1"}`}>
                  {OAUTH_GOOGLE_ENABLED && (
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin("google")}
                      disabled={oauthLoading !== null}
                      className="inline-flex w-full justify-center items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 transition-all"
                    >
                      {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                      Google
                    </button>
                  )}
                  {OAUTH_AZURE_ENABLED && (
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin("azure")}
                      disabled={oauthLoading !== null}
                      className="inline-flex w-full justify-center items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 transition-all"
                    >
                      {oauthLoading === "azure" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MicrosoftIcon />}
                      Microsoft
                    </button>
                  )}
                </div>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Or with email
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              </>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" name="firstName" required autoComplete="given-name" placeholder="Jane" />
                  <Field label="Last name" name="lastName" required autoComplete="family-name" placeholder="Doe" />
                </div>
              )}

              <div>
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  invalid={emailError}
                />
                {emailError && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">Enter a valid email address.</p>
                )}
              </div>

              {!isForgot && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    {!isSignup && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-xs font-bold text-royal-gold hover:text-royal-gold-dark"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      placeholder={isSignup ? "Create a strong password" : "Your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={isSignup ? 8 : undefined}
                      className="block w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-slate-400 focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-royal-navy transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {isSignup && password.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((bar) => (
                          <div
                            key={`bar-${bar}`}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              bar < strength.score ? strength.color : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <ul className="grid grid-cols-2 gap-1.5">
                        {checks.map((c) => (
                          <li
                            key={c.label}
                            className={`flex items-center gap-1.5 text-[11px] font-medium ${
                              c.ok ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-700" role="alert">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-sm text-emerald-700" role="status">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-royal-navy py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-royal-navy/10 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-navy disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isForgot ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {isForgot && (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="w-full text-center text-sm font-semibold text-slate-500 hover:text-royal-navy transition-colors"
                >
                  ← Back to sign in
                </button>
              )}

              {isSignup && (
                <p className="text-[11px] text-slate-400 leading-relaxed text-center pt-1">
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="font-semibold text-slate-500 hover:text-royal-navy underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-slate-500 hover:text-royal-navy underline">Privacy Policy</Link>.
                </p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  value,
  onChange,
  onBlur,
  invalid,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  invalid?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`block w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
          invalid
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-royal-gold focus:ring-royal-gold/20"
        }`}
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.75c1.77 0 3.36.61 4.61 1.8l3.42-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.09C6.21 6.86 8.87 4.75 12 4.75Z" fill="#EA4335" />
      <path d="M23.49 12.28c0-.79-.08-1.55-.19-2.28H12v4.51h6.47c-.29 1.48-1.13 2.74-2.39 3.59l3.86 3c2.26-2.09 3.55-5.18 3.55-8.82Z" fill="#4285F4" />
      <path d="M5.26 14.29A7.2 7.2 0 0 1 4.88 12c0-.8.14-1.57.38-2.3L1.28 6.61A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.98-3.1Z" fill="#FBBC05" />
      <path d="M12 24c3.24 0 5.97-1.07 7.95-2.9l-3.87-3c-1.07.72-2.46 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.95l-3.99 3.09C3.26 21.31 7.31 24 12 24Z" fill="#34A853" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#7fba00" d="M12 1h10v10H12z" />
      <path fill="#00a4ef" d="M1 12h10v10H1z" />
      <path fill="#ffb900" d="M12 12h10v10H12z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-navy" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
