import { NextResponse } from "next/server";
import { isConfiguredEnvValue } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const OPTIONAL_ENV = [
  "NIM_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

export async function GET() {
  const env = Object.fromEntries(
    REQUIRED_ENV.map((key) => [key, isConfiguredEnvValue(process.env[key])])
  );
  const optionalEnv = Object.fromEntries(
    OPTIONAL_ENV.map((key) => [key, isConfiguredEnvValue(process.env[key])])
  );

  let supabase = false;
  let supabaseError: string | null = null;
  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
    const { error } = await client.from("cv_templates").select("id").limit(1);
    supabase = !error;
    if (error) {
      supabaseError = error.message;
      if (process.env.NODE_ENV === "production") {
        console.error(JSON.stringify({ scope: "health.supabase", message: error.message }));
      }
    }
  } catch (error) {
    supabase = false;
    supabaseError = error instanceof Error ? error.message : "Unknown Supabase error";
    if (process.env.NODE_ENV === "production") {
      console.error(JSON.stringify({ scope: "health.supabase", message: supabaseError }));
    }
  }

  const configured = Object.values(env).every(Boolean);
  const ok = configured && supabase;
  const isProd = process.env.NODE_ENV === "production";

  return NextResponse.json(
    {
      ok,
      checks: {
        env,
        optionalEnv,
        supabase,
        ...(isProd ? {} : { supabaseError }),
      },
    },
    {
      status: ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
