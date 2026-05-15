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

export const PRICE_GBP = 799; // GBP 7.99 in pence
export const PRICE_DISPLAY = "GBP 7.99";
