import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CvBuilderForm } from "@/components/cv-form/cv-builder-form";
export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; template?: string }>;
}) {
  const { id, template } = await searchParams;
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
    <div className="bg-ivory min-h-screen flex flex-col">
      <Header 
        userEmail={user.email} 
        isPremium={isPremium} 
        showBack 
        backLabel="Dashboard" 
      />
      
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8">
        <CvBuilderForm initialId={id} initialTemplate={template} isPremium={isPremium} />
      </main>
    </div>
  );
}
