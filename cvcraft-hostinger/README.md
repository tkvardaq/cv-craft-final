# CvCRAFT

AI-powered CV builder for the UK market — ATS-optimised templates, AI bullet rewriting, JD keyword matching, and Stripe-powered premium plans. Built on Next.js 16 (App Router, React 19, Turbopack), Supabase (auth + Postgres + RLS), Stripe, and react-pdf.

## Quick start

```bash
npm ci
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open http://localhost:3000.

## Required env vars

See `.env.example`. Minimum to boot:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NIM_API_KEY` (NVIDIA NIM, for AI features)
- `NEXT_PUBLIC_SITE_URL`

For payments: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.

## Database

Run all migrations in `supabase/migrations/` in order against your Supabase project. RLS is enabled on every user-facing table.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full Hostinger (Node.js) deploy procedure. The app **requires** a Node.js runtime — do not use static export.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint
