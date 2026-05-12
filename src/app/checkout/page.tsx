import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const params = await searchParams;

  if (params.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 border border-slate-100">
          <div className="flex justify-center">
            <CheckCircle className="h-20 w-20 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-navy-900">Payment Successful!</h1>
            <p className="text-slate-600">
              Thank you for upgrading to Premium. Your account has been upgraded, and you now have access to all premium features.
            </p>
          </div>
          <div className="pt-4">
            <Button asChild className="w-full bg-navy-600 hover:bg-navy-700 text-white">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (params.cancelled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 border border-slate-100">
          <div className="flex justify-center">
            <XCircle className="h-20 w-20 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-navy-900">Payment Cancelled</h1>
            <p className="text-slate-600">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>
          <div className="pt-4 flex flex-col space-y-3">
            <Button asChild className="w-full bg-navy-600 hover:bg-navy-700 text-white">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full text-navy-700 border-navy-200 hover:bg-navy-50">
              <Link href="/#pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If neither success nor cancelled is in searchParams, redirect to dashboard
  redirect("/dashboard");
}
