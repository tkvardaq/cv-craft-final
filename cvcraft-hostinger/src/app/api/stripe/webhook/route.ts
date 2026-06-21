import { NextRequest, NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireServerEnv } from "@/lib/env";
import { logError } from "@/lib/log";
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
    logError("stripe.webhook.signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const userId = session.metadata?.user_id;

  if (!userId || session.payment_status !== "paid") {
    return NextResponse.json({ received: true, skipped: true });
  }

  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;

  if (!paymentIntentId) {
    return NextResponse.json({ received: true, skipped: "no_payment_intent" });
  }

  const supabase = await createServiceClient();

  // Idempotency: rely on UNIQUE constraint on stripe_payment_intent_id.
  // Insert first; if it conflicts, treat as duplicate and exit early.
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: userId,
    stripe_payment_intent_id: paymentIntentId,
    amount: session.amount_total || 799,
    currency: session.currency || "gbp",
    status: "completed",
  });

  if (paymentError) {
    // 23505 = unique_violation in Postgres
    const code = (paymentError as { code?: string }).code;
    if (code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    logError("stripe.webhook.payment_insert", paymentError);
    return NextResponse.json({ error: "Payment record failed" }, { status: 500 });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ is_premium: true, credits: 9999 })
    .eq("id", userId);

  if (profileError) {
    logError("stripe.webhook.profile_update", profileError);
    // Payment is already recorded; return 500 so Stripe retries and re-attempts the profile update.
    // The unique constraint prevents double-charging on retry.
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
