"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl, isConfiguredEnvValue } from "@/lib/env";

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Update .env.local with your real Supabase URL and anon key." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!user) {
    return { error: "User not found" };
  }

  // Upsert profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, is_premium: false, credits: 3 })
    .select();

  if (profileError) {
    console.error('Profile upsert error:', profileError);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Update .env.local with your real Supabase URL and anon key." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();

  if (!email || !password || !firstName || !lastName) {
    return { error: "Name, email, and password are required." };
  }

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
    return { error: error.message };
  }

  // Upsert profile if we have a user (even if session is null, we have a user object)
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, is_premium: false, credits: 3 })
      .select();

    if (profileError) {
      console.error('Profile upsert error:', profileError);
    }
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email to confirm your address, then sign in.",
    };
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
