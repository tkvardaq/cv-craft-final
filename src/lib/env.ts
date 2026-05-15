type ServerEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "NIM_API_KEY"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "NEXT_PUBLIC_SITE_URL";

export function requireServerEnv(key: ServerEnvKey): string {
  const value = process.env[key];
  if (!isConfiguredEnvValue(value)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export function isConfiguredEnvValue(value: string | undefined): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase();
  return !(
    normalized.startsWith("your_") ||
    normalized.startsWith("your-") ||
    normalized.includes("_or_test_") ||
    normalized.includes("test_key") ||
    normalized.includes("placeholder") ||
    normalized.includes("example.com")
  );
}

export function getPublicSiteUrl(request?: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return request ? new URL(request.url).origin : "http://localhost:3000";
  }

  throw new Error("Missing required environment variable: NEXT_PUBLIC_SITE_URL");
}
