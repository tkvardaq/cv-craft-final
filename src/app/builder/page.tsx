import { CvBuilderForm } from "@/components/cv-form/cv-builder-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.is_premium || false;

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-royal-navy tracking-tight">CV Builder</h1>
            <p className="text-slate-500 mt-2 text-lg">
              Craft your professional story with precision.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
             <span>Auto-saving enabled</span>
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <CvBuilderForm initialId={id} isPremium={isPremium} />
      </div>
    </div>
  );
}

