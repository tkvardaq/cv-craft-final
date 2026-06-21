import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { CoverLettersList } from "@/components/cover-letters/cover-letters-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letters",
  description: "AI-tailored cover letters built from your CV.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CoverLettersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/cover-letters");

  const { data: letters } = await supabase
    .from("cover_letters")
    .select("id, title, company_name, role_title, tone, updated_at, cv_id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: cvs } = await supabase
    .from("cv_vault")
    .select("id, title")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-screen bg-ivory text-royal-navy font-sans">
      <Header userEmail={user.email} />
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Cover Letters</h1>
            <p className="text-slate-500 mt-2">AI-tailored, role-specific, ready to send.</p>
          </div>
        </div>
        <CoverLettersList initialLetters={letters ?? []} cvs={cvs ?? []} />
      </main>
    </div>
  );
}
