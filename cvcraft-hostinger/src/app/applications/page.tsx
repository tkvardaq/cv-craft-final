import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { ApplicationsBoard } from "@/components/applications/applications-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track jobs you've applied to, status, and notes.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/applications");

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
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
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter">Job Tracker</h1>
          <p className="text-slate-500 mt-2">Every role you&apos;ve saved, applied to, and won — in one place.</p>
        </div>
        <ApplicationsBoard initialApplications={applications ?? []} cvs={cvs ?? []} />
      </main>
    </div>
  );
}
