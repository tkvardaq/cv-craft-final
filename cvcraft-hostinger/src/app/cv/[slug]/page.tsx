import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import type { CV } from "@/lib/schemas/cv";
import { PublicCvView } from "@/components/public/public-cv-view";

export const dynamic = "force-dynamic";

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function loadCv(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = anonClient();
  const { data } = await supabase
    .from("cv_vault")
    .select("json_content, title, public_view_count")
    .eq("public_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cv = await loadCv(slug);
  if (!cv) return { title: "CV not found" };

  const content = cv.json_content as CV;
  const name = `${content.personal?.firstName ?? ""} ${content.personal?.lastName ?? ""}`.trim();
  const headline =
    (content.experience?.[0]?.title && content.experience[0].company)
      ? `${content.experience[0].title} · ${content.experience[0].company}`
      : "Professional CV";

  return {
    title: `${name || cv.title} — ${headline}`,
    description: content.professionalSummary?.slice(0, 200) ?? `Professional CV by ${name}`,
    openGraph: {
      title: `${name || cv.title} — ${headline}`,
      description: content.professionalSummary?.slice(0, 200) ?? "",
      type: "profile",
    },
    robots: { index: false, follow: true },
  };
}

export default async function PublicCvPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cv = await loadCv(slug);
  if (!cv) notFound();

  // Fire-and-forget view counter increment.
  try {
    const supabase = anonClient();
    await supabase.rpc("increment_cv_view_count", { slug });
  } catch {
    // non-critical
  }

  const content = cv.json_content as CV;
  return <PublicCvView cv={content} title={cv.title} />;
}
