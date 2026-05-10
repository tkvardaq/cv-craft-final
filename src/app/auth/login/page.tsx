"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { FileText, Mail } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = isLogin ? await login(formData) : await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "azure") => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity">
          <FileText className="h-10 w-10 text-royal-gold" />
          <span className="text-3xl font-bold tracking-tight text-royal-navy">CvCRAFT</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-royal-navy">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-center text-sm text-royal-navy/70">
          Or{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-medium text-royal-gold hover:text-royal-gold-dark transition-colors"
          >
            {isLogin ? "start your 14-day free trial" : "sign in to your existing account"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-royal-navy/5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-royal-navy">First name</label>
                  <div className="mt-1">
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-royal-gold focus:outline-none focus:ring-royal-gold sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-royal-navy">Last name</label>
                  <div className="mt-1">
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-royal-gold focus:outline-none focus:ring-royal-gold sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-royal-navy">Email address</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-royal-gold focus:outline-none focus:ring-royal-gold sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-royal-navy">Password</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-royal-gold focus:outline-none focus:ring-royal-gold sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-royal-navy py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-royal-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-navy disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuthLogin("google")}
                className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleOAuthLogin("azure")}
                className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Sign in with Microsoft</span>
                <Mail className="h-5 w-5 text-[#00a4ef]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-navy"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
