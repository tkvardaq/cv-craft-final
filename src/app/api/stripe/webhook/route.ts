import { NextResponse } from 'next/server';
import { getStripeServerClient } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

interface StripeSession {
  metadata: {
    user_id?: string;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get('stripe-signature') ?? '';
  let event;

  try {
    const stripeClient = getStripeServerClient();
    event = stripeClient.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as StripeSession;
    const userId = session.metadata?.user_id;
    if (userId) {
      const supabase = await createClient();
      await supabase
        .from('profiles')
        .update({ is_premium: true, credits: 9999 }) // unlimited
        .eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}