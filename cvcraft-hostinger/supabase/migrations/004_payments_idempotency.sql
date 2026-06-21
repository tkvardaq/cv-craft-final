-- Ensure Stripe webhook retries do not create duplicate payment rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id_unique
  ON public.payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
