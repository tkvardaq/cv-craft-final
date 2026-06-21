import { redirect } from "next/navigation";
import { CheckCircle, Crown, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isStripeConfigured } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/checkout");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .single();
  const paymentsEnabled = isStripeConfigured();

  if (params.success) {
    return (
      <CheckoutShell
        icon={<CheckCircle className="h-20 w-20 text-emerald-500" />}
        title="Payment successful"
        description="Thank you for upgrading to Premium. Your account will unlock as soon as Stripe confirms the webhook."
      >
        <Button asChild className="w-full bg-royal-navy hover:bg-slate-800 text-white">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </CheckoutShell>
    );
  }

  if (params.cancelled) {
    return (
      <CheckoutShell
        icon={<XCircle className="h-20 w-20 text-red-500" />}
        title="Payment cancelled"
        description="Your payment was cancelled. No charges were made to your account."
      >
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full bg-royal-navy hover:bg-slate-800 text-white">
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/checkout">Try again</Link>
          </Button>
        </div>
      </CheckoutShell>
    );
  }

  if (profile?.is_premium) {
    return (
      <CheckoutShell
        icon={<Crown className="h-20 w-20 text-royal-gold" />}
        title="Premium is active"
        description="Your account already has access to premium templates, AI rewrites, and ATS tools."
      >
        <Button asChild className="w-full bg-royal-navy hover:bg-slate-800 text-white">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </CheckoutShell>
    );
  }

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-royal-gold/10 flex items-center justify-center">
            <Crown className="h-6 w-6 text-royal-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-royal-navy">Upgrade to Premium</h1>
            <p className="text-sm text-slate-500">Unlock the full CvCRAFT builder.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 mb-6 space-y-3">
          {[
            "All premium templates",
            "Unlimited AI bullet rewrites",
            "Full ATS matching reports",
            "High-fidelity PDF export",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-royal-navy">
              <Sparkles className="h-4 w-4 text-royal-gold" />
              {feature}
            </div>
          ))}
        </div>

        {paymentsEnabled ? (
          <form action="/api/stripe/create-checkout" method="POST">
            <Button className="w-full bg-royal-gold hover:bg-royal-gold-dark text-white font-bold h-12">
              Continue to secure checkout
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-royal-gold/30 bg-royal-gold/10 p-4 text-sm font-semibold text-royal-navy">
            Premium checkout is not enabled yet. The free builder, ATS tools, and PDF export remain available.
          </div>
        )}

        <Button asChild variant="ghost" className="w-full mt-3">
          <Link href="/dashboard">Not now</Link>
        </Button>
      </div>
    </main>
  );
}

function CheckoutShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center space-y-6 border border-slate-100">
        <div className="flex justify-center">{icon}</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-royal-navy">{title}</h1>
          <p className="text-slate-600">{description}</p>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </main>
  );
}
