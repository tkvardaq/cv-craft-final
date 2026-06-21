"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl, isConfiguredEnvValue } from "@/lib/env";
import { isRateLimited } from "@/lib/rate-limit";
import { logError } from "@/lib/log";

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") || "unknown";
}

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid_grant") || m.includes("invalid credentials")) {
    return "Incorrect email or password.";
  }
  if (m.includes("email") && m.includes("confirm")) {
    return "Please confirm your email address before signing in.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Please try again in a few minutes.";
  }
  if (m.includes("network") || m.includes("fetch") || m.includes("timeout")) {
    return "Service temporarily unavailable. Please try again shortly.";
  }
  return message;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const ip = await clientKey();
  if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return { error: "Too many login attempts. Please try again in 15 minutes." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: friendlyAuthError(error.message) };
    }
  } catch (error) {
    logError("auth.login", error);
    return { error: "Service temporarily unavailable. Please try again shortly." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const ip = await clientKey();
  if (isRateLimited(`signup:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many signup attempts. Please try again in an hour." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();

  if (!email || !password || !firstName || !lastName) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        },
        emailRedirectTo: `${getPublicSiteUrl()}/auth/callback`,
      },
    });

    if (error) {
      return { error: friendlyAuthError(error.message) };
    }

    if (!data.session) {
      return {
        message: "Account created. Check your email to confirm your address, then sign in.",
      };
    }
  } catch (error) {
    logError("auth.signup", error);
    return { error: "Service temporarily unavailable. Please try again shortly." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const ip = await clientKey();
  if (isRateLimited(`reset:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many reset requests. Please try again in an hour." };
  }

  const email = String(formData.get("email") || "").trim();
  if (!email) {
    return { error: "Enter your email address." };
  }

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getPublicSiteUrl()}/auth/callback?next=/auth/reset-password`,
    });
  } catch (error) {
    logError("auth.reset", error);
    // Intentionally do not reveal failures — avoid email enumeration.
  }

  // Always return the same message regardless of whether the email exists.
  return {
    message: "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Authentication is not configured. Please contact support." };
  }

  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Your reset link has expired. Please request a new one." };
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: friendlyAuthError(error.message) };
    }
  } catch (error) {
    logError("auth.updatePassword", error);
    return { error: "Service temporarily unavailable. Please try again shortly." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function isSupabaseConfigured() {
  return (
    isConfiguredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isConfiguredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}
