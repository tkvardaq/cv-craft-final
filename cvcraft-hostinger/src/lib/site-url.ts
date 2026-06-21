const FALLBACK = "https://silver-sandpiper-441832.hostingersite.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return FALLBACK;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return FALLBACK;
  }
}
