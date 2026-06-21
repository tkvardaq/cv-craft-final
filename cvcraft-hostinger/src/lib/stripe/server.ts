import Stripe from "stripe";
import { isConfiguredEnvValue, requireServerEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  stripeClient ??= new Stripe(requireServerEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });

  return stripeClient;
}

export function isStripeConfigured() {
  return (
    isConfiguredEnvValue(process.env.STRIPE_SECRET_KEY) &&
    isConfiguredEnvValue(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) &&
    isConfiguredEnvValue(process.env.STRIPE_WEBHOOK_SECRET)
  );
}

// Price in pence. Override via STRIPE_PRICE_PENCE env var without redeploying code.
export const PRICE_GBP = Number(process.env.STRIPE_PRICE_PENCE) > 0
  ? Number(process.env.STRIPE_PRICE_PENCE)
  : 799;
export const PRICE_DISPLAY = `£${(PRICE_GBP / 100).toFixed(2)}`;
