import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (userId) {
      const supabase = await createServiceClient();

      // Set user as premium
      await supabase
        .from("profiles")
        .update({ is_premium: true, credits: 9999 })
        .eq("id", userId);

      // Record payment
      await supabase.from("payments").insert({
        user_id: userId,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: session.amount_total || 799,
        currency: "gbp",
        status: "completed",
      });

      console.log(`User ${userId} upgraded to premium`);
    }
  }

  return NextResponse.json({ received: true });
}
