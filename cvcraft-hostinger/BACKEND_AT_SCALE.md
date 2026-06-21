# CvCRAFT — Backend Architecture for 1M MAU

**Target:** 1,000,000 monthly active users · UK + Ireland · minimum cost · reliable · no Supabase.

**Stack recommendation (TL;DR):**

| Layer | Today (free) | At 100k MAU | At 1M MAU |
|---|---|---|---|
| Compute | Hostinger Node | **Cloudflare Workers** | Cloudflare Workers + Fly.io regional |
| Database | Supabase (free) | **Neon Postgres** Launch ($19/mo) | Neon Scale ($69) → autoscale tier |
| Auth | Supabase Auth | **Auth.js (NextAuth)** | Same — scales linearly |
| Email | Supabase SMTP | **Resend** ($0 → $20/mo) | Resend ($90 for 100k/mo) |
| Cache / Rate limit | In-memory | **Upstash Redis** (free) | Upstash Pay-as-you-go |
| File storage (PDFs) | none (client-only) | none | **Cloudflare R2** if archiving needed |
| AI | NIM direct | NIM + cache | NIM + Llama-fallback + per-user limits |
| **Total monthly cost** | **£0** | **~£40** | **~£300–500** |

Compare: Supabase Pro at 1M MAU = ~£2,300/month in overage alone. The recommended stack is **~6× cheaper at scale**.

---

## The hard truth about your constraints

### "Stay on Hostinger"
Hostinger's shared Node hosting is one process on one machine. No autoscaling, no load balancer, no edge cache. At ~50 concurrent requests it will start queuing. At 1M MAU:

- Steady state: ~30k DAU → ~2k concurrent at peak hours
- Peak (CV launch traffic, viral moment): 10k+ concurrent
- A single Hostinger Node process handles ~200 concurrent at best

**You will hit this wall well before 1M MAU.** Realistic ceiling: 30–80k MAU depending on AI/PDF load.

**Recommendation:** stay on Hostinger for launch, but plan to migrate compute to **Cloudflare Workers** at around 30k MAU. Cloudflare Workers free tier handles 100k requests/day; paid ($5/mo) handles 10M requests/day. It auto-scales globally and is *cheaper* than Hostinger at scale.

### "No Supabase"
Fair. Supabase Pro is fine up to 100k MAU at £20/mo, but at 1M MAU you'd pay £2,300+/mo in MAU overage alone. We'll replace it with **Neon Postgres** (just the database) + **Auth.js** (auth handled in your own Next.js app code) + **Cloudflare R2** if you ever need file storage.

### "UK + Ireland only" ✓
This actually makes things cheaper — single region, no replication.

### "Medium AI with throttles" ✓
NIM at $1.5/$1.5 per 1M tokens with our caching layer is already cost-effective. Throttles are already implemented.

---

## Recommended stack — what each piece does and why

### 1. Database → **Neon Postgres** (replaces Supabase)

**Why Neon over alternatives:**
- Serverless Postgres — pay only for compute time you use. Scales to zero when idle.
- Branching like git — instant dev/staging environments for free.
- Region: `eu-central-1` (Frankfurt) — 25ms latency from UK.
- Full Postgres feature parity with your current schema (JSONB, triggers, RLS, all your migrations work unchanged).
- Free tier: 0.5GB, perfect for staging.
- Launch tier: **$19/mo** for 10GB + 300 hours compute (covers ~300k MAU easily).
- Scale tier: **$69/mo** for 50GB + 750 hours (covers ~1M MAU).

**Alternatives considered:**
- Xata — newer, less mature.
- Cockroach Serverless — overkill for single-region.
- Self-host on Hetzner (€4/mo) — cheapest but requires DevOps; one bad upgrade and you lose data.
- PlanetScale — left Postgres for Vitess; not a fit.

### 2. Auth → **Auth.js (NextAuth v5)** (replaces Supabase Auth)

**Why Auth.js:**
- Runs inside your Next.js app — no separate service.
- Free forever. No per-MAU cost.
- Drop-in providers for Google, Microsoft (Azure AD), LinkedIn, Apple, GitHub, plus email/password (Credentials).
- Sessions stored in Postgres (Neon) via Drizzle/Prisma adapter — survives restarts, no Redis needed.
- Magic-link email auth supported.

**Trade-off:** more code than Supabase Auth (it does more for you), but you own it and it costs nothing.

### 3. Email → **Resend**

- UK-friendly delivery (UK domain reputation).
- Free: 3k emails/mo, 100/day.
- Paid: $20/mo = 50k emails (covers ~50k signups + password resets).
- At 1M MAU with ~10k signups/day: $90/mo for 500k emails.
- Excellent React Email templates.

**Alternative:** Postmark for transactional reliability ($15/mo for 10k, scales linearly). Slightly better deliverability, more expensive.

### 4. Cache + Rate limiting → **Upstash Redis**

- Replaces the in-memory rate limiter (which doesn't survive restarts and doesn't work across multiple compute instances).
- Free: 10k commands/day (enough for ~5k MAU).
- Pay-as-you-go: $0.20 per 100k commands. At 1M MAU and 10 commands/user/mo = $20/mo.
- Also caches NIM responses with TTL — cuts AI bill by ~50%.

### 5. Compute (eventually) → **Cloudflare Workers**

When Hostinger starts queuing requests:

- Globally distributed (UK + Ireland nodes 2–10ms from users).
- Free: 100k requests/day, 10ms CPU per request.
- Paid: $5/mo = 10M requests/day, 50ms CPU.
- At 1M MAU with avg 30 requests/user/mo = 30M requests/mo — comfortably inside paid tier.
- Next.js on Workers via `@opennextjs/cloudflare` — fully supported.

**Hostinger stays useful for:** initial launch, dev/staging, low-traffic admin tooling.

### 6. PDF generation
**Stays client-side** (current). Already implemented via `@react-pdf/renderer` running in the user's browser. Zero server cost. This is the single biggest cost saving — most CV builders waste money rendering PDFs server-side.

If you ever need server PDFs (e.g. emailed signed CVs): use **Cloudflare Browser Rendering** ($0.09 per 1k renders) or **Browserless.io**.

### 7. AI → **NVIDIA NIM** (current) with hardened cost layer

Already built:
- SHA-256 cache keys
- 30-day TTL
- Per-user/IP rate limits
- Input sanitization

Add at scale:
- **Fallback model**: free users get Llama-3.1-8B (cheaper), paid users get 70B/405B.
- **Daily budget caps** per user enforced server-side.
- **Batch queue** for non-realtime calls (summary generation).

Estimated AI cost at 1M MAU, medium usage with 50% cache hit:
- ~5M AI calls/mo, 2.5M hit cache (free), 2.5M call NIM
- ~$0.0001 per call avg → **$250/mo**

---

## Migration plan — Supabase → Neon + Auth.js

This is the biggest piece of work. Estimated effort: **2–3 days of focused work.**

### Phase 1: Migrate database (½ day)
1. Create Neon project in `eu-central-1`.
2. Export your existing Supabase schema (we have it: `supabase/all-in-one-setup.sql`).
3. Run the SQL against Neon — works as-is, Postgres is Postgres.
4. Update `DATABASE_URL` env var in code; replace `@supabase/supabase-js` calls with raw Postgres client (or **Drizzle** ORM — recommended).

### Phase 2: Migrate auth (1–2 days)
1. Install `next-auth@5` and `@auth/drizzle-adapter`.
2. Configure providers in `src/auth.ts`:
   ```ts
   import NextAuth from "next-auth";
   import Google from "next-auth/providers/google";
   import AzureAD from "next-auth/providers/microsoft-entra-id";
   import LinkedIn from "next-auth/providers/linkedin";
   import Credentials from "next-auth/providers/credentials";
   ```
3. Replace `createClient` calls with `auth()`.
4. Move RLS-enforced queries to explicit `.where("user_id = ?", user.id)` checks (Postgres still enforces but now in app layer).
5. Update middleware to use Auth.js session cookies.

### Phase 3: Replace ancillary services (½ day)
- Email: swap Supabase SMTP for Resend.
- Storage: not needed (PDFs client-side).
- Realtime: not needed.

### Phase 4: Decommission Supabase
- Run for 1 week in parallel, verify no errors.
- Delete Supabase project.

I can do Phases 1–3 in a subsequent session if you want to commit to the migration.

---

## Phased cost model (UK + Ireland, your stack)

| Phase | MAU | Cost/mo | What you'd actually pay for |
|---|---|---|---|
| **Launch** | 0–5k | **£0** | Hostinger (existing), Neon free, Auth.js free, Resend free, Upstash free |
| **Growth** | 5k–50k | **£25** | Neon Launch $19 + Resend $20 = £40 ≈ £25/mo when you average free quotas in |
| **Scale** | 50k–250k | **£70–120** | Neon Launch, Resend $20, Upstash $5, **migrate compute to Cloudflare Workers** ($5/mo), Sentry free tier |
| **High scale** | 250k–1M | **£300–500** | Neon Scale $69, Resend $90, Upstash $20, CF Workers $5, NIM ~$250, Sentry Team $26 |
| **Beyond 1M** | 1M+ | **£800–2k** | Neon autoscale, larger Redis, more AI, dedicated observability |

For comparison, the same scale on Supabase + Vercel Pro + Vercel AI SDK would be roughly **£3,500–6,000/month at 1M MAU**.

---

## What the architecture looks like at 1M MAU

```
                ┌──────────────────────────────┐
                │  Cloudflare DNS + WAF + CDN  │  free tier
                └──────────────┬───────────────┘
                               │
                ┌──────────────▼───────────────┐
                │  Cloudflare Workers (UK/IE)  │  $5/mo
                │  Next.js (App Router) edge   │
                └──────┬───────────────┬───────┘
                       │               │
       ┌───────────────▼──┐         ┌──▼─────────────────┐
       │  Neon Postgres   │         │  Upstash Redis     │
       │  eu-central-1    │         │  (cache + rate     │
       │  $69/mo          │         │   limit) $20/mo    │
       └──────────────────┘         └────────────────────┘
                       │
        ┌──────────────┼──────────────┬────────────────┐
        ▼              ▼              ▼                ▼
   ┌─────────┐   ┌──────────┐   ┌─────────┐    ┌────────────┐
   │  NIM    │   │  Resend  │   │  Stripe │    │  CF R2     │
   │  AI     │   │  email   │   │  pay    │    │  (optional)│
   │ $250    │   │  $90     │   │  fees   │    │   $5       │
   └─────────┘   └──────────┘   └─────────┘    └────────────┘
```

PDF rendering: stays in user's browser. Zero server cost.

---

## Reliability features built in

- **Auto-failover DNS** via Cloudflare.
- **Neon point-in-time recovery** (free 7-day history on Launch).
- **Health endpoint** (`/api/health`) — already wired.
- **Per-route error IDs** — already wired (every server error returns a UUID matching server logs).
- **Rate limiting** — moves from in-memory to Upstash so it survives restarts.
- **Stripe webhook idempotency** — already wired (unique constraint on payment_intent_id).
- **Graceful degradation when Supabase/Neon down** — already wired (proxy.ts handles missing env, public pages still load).

What to add for true production:
- **Sentry** for error tracking (free tier 5k events/mo, then $26/mo for Team).
- **PostHog** for product analytics + funnel tracking (free 1M events/mo, perfect).
- **Better Stack / Cronitor** for uptime monitoring ($0–10/mo).

---

## My honest recommendation

You said "minimum cost". Here's the realistic ladder:

1. **Now → 5k MAU**: stay exactly as you are. Cost: £0.
2. **5k → 30k MAU**: migrate off Supabase to Neon + Auth.js. Cost rises to ~£40/mo, but you've left the per-MAU pricing trap.
3. **30k → 100k MAU**: migrate compute from Hostinger to Cloudflare Workers. Cost: ~£70/mo total.
4. **100k → 1M MAU**: scale Neon + add Upstash. Cost: ~£300–500/mo total.

**Don't migrate today.** Migration is real work. Do it when you can prove demand (e.g. 5k+ MAU and growing 30%+ month-over-month). Until then your current Supabase + Hostinger setup is fine and is what's deployed now.

When you're ready, ping me and I'll do the Neon + Auth.js migration in a focused session. I'd produce a feature-flagged dual-write so you can flip back if anything breaks.

---

## Questions I'd still want answered before migration day

1. **Realistic launch MAU forecast** — is "1M MAU in a month" aspirational or do you have a marketing channel that genuinely produces that? Drives whether we migrate week 1 or year 1.
2. **Premium conversion rate** — at what % free → paid does the AI bill become a real problem? Sets how aggressive the AI throttles should be.
3. **Are you ok with email-only signup at launch**, adding Google/Microsoft after the first 1k users? Removes a half-day of OAuth provider setup blocker.
4. **GDPR / data residency** — do you need a Data Processing Agreement (DPA)? Neon, Resend, Cloudflare, Upstash all offer them, but it's worth confirming early.
