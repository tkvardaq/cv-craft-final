import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn("Stripe Publishable Key is missing. Payments will be disabled.");
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
