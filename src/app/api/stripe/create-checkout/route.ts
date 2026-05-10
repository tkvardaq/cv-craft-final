import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_GBP } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if already premium
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();

    if (profile?.is_premium) {
      return NextResponse.json(
        { error: "You are already a premium user" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "CVCraft Premium",
              description: "Lifetime access: no watermark, unlimited AI rewrites, ATS-Ready badge",
            },
            unit_amount: PRICE_GBP,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      metadata: {
        user_id: user.id,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe session URL");
    }

    return NextResponse.redirect(session.url, { status: 303 });

  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
