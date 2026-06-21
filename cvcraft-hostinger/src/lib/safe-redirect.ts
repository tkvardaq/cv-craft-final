const ALLOWED_PATHS = new Set<string>([
  "/",
  "/dashboard",
  "/builder",
  "/checkout",
  "/cover-letters",
  "/applications",
  "/templates",
  "/auth/reset-password",
]);

const ALLOWED_PREFIXES = [
  "/builder/",
  "/dashboard/",
  "/checkout/",
  "/cover-letters/",
  "/applications/",
];

export function safeRedirectPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;

  const [pathOnly] = next.split("?");
  if (ALLOWED_PATHS.has(pathOnly)) return next;
  if (ALLOWED_PREFIXES.some((p) => pathOnly.startsWith(p))) return next;

  return fallback;
}
