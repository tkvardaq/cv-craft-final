import { NextRequest, NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireServerEnv } from "@/lib/env";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      requireServerEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (userId && session.payment_status === "paid") {
      const supabase = await createServiceClient();
      const paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

      if (paymentIntentId) {
        const { data: existingPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("stripe_payment_intent_id", paymentIntentId)
          .maybeSingle();

        if (existingPayment) {
          return NextResponse.json({ received: true, duplicate: true });
        }
      }

      // Set user as premium
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_premium: true, credits: 9999 })
        .eq("id", userId);

      if (profileError) {
        console.error("Failed to update premium profile:", profileError);
        return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
      }

      // Record payment
      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: userId,
        stripe_payment_intent_id: paymentIntentId,
        amount: session.amount_total || 799,
        currency: "gbp",
        status: "completed",
      });

      if (paymentError) {
        console.error("Failed to record payment:", paymentError);
        return NextResponse.json({ error: "Payment record failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
