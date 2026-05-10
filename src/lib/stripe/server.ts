import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PRICE_GBP = 799; // £7.99 in pence
export const PRICE_DISPLAY = "£7.99";
