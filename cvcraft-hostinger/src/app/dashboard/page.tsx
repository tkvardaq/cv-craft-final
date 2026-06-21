import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, Crown, Settings, ChevronRight } from "lucide-react";
import { CvList } from "@/components/dashboard/cv-list";
import { Header } from "@/components/layout/header";
import { isStripeConfigured, PRICE_DISPLAY } from "@/lib/stripe/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your saved CVs and subscription.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch CVs from the vault
  const { data: cvs } = await supabase
    .from("cv_vault")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Fetch user profile to check premium status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, full_name")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.is_premium || false;
  const paymentsEnabled = isStripeConfigured();
  const firstName = (profile?.full_name || "").trim().split(" ")[0];

  return (
    <div className="min-h-screen bg-ivory text-royal-navy font-sans">
      <Header userEmail={user.email} isPremium={isPremium} />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-royal-navy">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
            <p className="text-slate-500 mt-1 text-lg">Your precision-crafted portfolio is waiting.</p>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 bg-royal-navy text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-royal-navy/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-5 w-5" />
            Create New CV
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: CVs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-royal-gold" />
                Recent Resumes
              </h2>
              {cvs && cvs.length > 0 && (
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                  {cvs.length} Total
                </span>
              )}
            </div>
            
            <CvList initialCvs={cvs || []} />
          </div>

          {/* Sidebar: Premium Status */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Crown className="h-5 w-5 text-royal-gold" />
              Subscription
            </h2>
            <div className="bg-gradient-to-br from-royal-navy to-slate-800 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-white/5 group-hover:rotate-12 transition-transform duration-700">
                <Crown className="h-40 w-40" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                  <Crown className="h-4 w-4 text-royal-gold shadow-glow" />
                  <span className="font-bold text-xs uppercase tracking-widest text-royal-gold">
                    {isPremium ? "Premium Active" : "Free Tier"}
                  </span>
                </div>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">
                  {isPremium 
                    ? "You have unlimited access to all AI features, ATS optimization, and premium templates."
                    : "Upgrade to unlock unlimited AI bullet rewriting and full ATS matching reports."}
                </p>
                {!isPremium && (
                  <form action="/api/stripe/create-checkout" method="POST">
                    <button
                      type="submit"
                      disabled={!paymentsEnabled}
                      title={paymentsEnabled ? `Upgrade to Pro (${PRICE_DISPLAY})` : "Payments coming soon"}
                      className="w-full bg-royal-gold text-white font-bold py-4 rounded-2xl hover:bg-royal-gold-light transition-all shadow-lg shadow-royal-gold/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {paymentsEnabled ? `Upgrade to Pro · ${PRICE_DISPLAY}` : "Coming soon"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                <Settings className="h-5 w-5 text-slate-400" />
                <h3 className="font-bold text-royal-navy">Account Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                  <span className="font-bold text-sm text-royal-navy truncate">{user.email}</span>
                </div>
                <div className="pt-2">
                   <button className="text-sm font-bold text-royal-gold hover:text-royal-gold-dark transition-colors flex items-center gap-1 group">
                     Update Password
                     <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
