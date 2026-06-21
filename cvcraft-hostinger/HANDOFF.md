# CvCRAFT — Production Hand-off

Everything below is **already done** on the backend. You only need to (1) push the repo, (2) configure auth providers in Supabase, (3) update Hostinger env vars.

---

## What's already live

✅ **Supabase project provisioned** — `cvcraft` in `eu-west-2` (London)
- Project ref: `zaabjfnapioewdnusvvl`
- API URL: `https://zaabjfnapioewdnusvvl.supabase.co`
- 8 tables created with RLS enabled: `profiles`, `cv_vault`, `cv_templates`, `sector_keywords`, `ai_cache`, `payments`, `cover_letters`, `applications`
- All 10 migrations applied (001–010)
- 5 templates pre-seeded in `cv_templates`
- Security advisors: clean (2 informational, 0 actionable warnings)

✅ **Code complete** — every feature you asked for is wired:
- Email/password signup with rate limit + friendly error messages
- Google + Microsoft + LinkedIn OAuth — buttons env-gated, hidden until enabled
- `/templates` public gallery
- `/cover-letters` — list + AI draft + tone selector
- `/applications` — job tracker with status board + filter chips
- `/cv/[slug]` — public CV sharing with view counter

✅ **Git repo initialised locally** — 2 commits, ready to push.

---

## Step 1 — Push to GitHub (one minute)

You need to do this from your machine because `gh` needs an interactive browser login.

```bash
cd "/Users/ecom/Documents/cv proj/prj/cvcraft-source"

# One-time: log in (opens browser)
gh auth login

# Create the repo + push (single command)
gh repo create cvcraft --public --source=. --remote=origin --push
```

After `gh auth login`:
- pick **GitHub.com** → **HTTPS** → **Login with a web browser**
- copy the one-time code → press Enter → paste in the browser

The `gh repo create` line then:
- creates `github.com/<your-username>/cvcraft`
- adds it as `origin`
- pushes `main` with all your commits

---

## Step 2 — Configure your live Hostinger env vars

Replace the existing values with these (the Supabase ones come from the project I just provisioned for you):

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://YOUR-LIVE-DOMAIN

NEXT_PUBLIC_SUPABASE_URL=https://zaabjfnapioewdnusvvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphYWJqZm5hcGlvZXdkbnVzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTI2NDQsImV4cCI6MjA5NDc2ODY0NH0.1EPW5GfwrTFdHWfBThhuLMFKvYePaysqSqvaP32TfiU

# Get the service role key (server-side only, never exposed to browsers):
# https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/settings/api-keys
SUPABASE_SERVICE_ROLE_KEY=PASTE_FROM_DASHBOARD

NIM_API_KEY=YOUR_EXISTING_NVIDIA_KEY

# OAuth toggles — set to "true" only AFTER configuring each provider below
NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=
NEXT_PUBLIC_OAUTH_AZURE_ENABLED=

# Stripe (leave blank for now)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Restart your Node app on Hostinger. Visit `/api/health` — should return `{"ok": true, ...}`.

---

## Step 3 — Configure OAuth providers

Open `AUTH_SETUP.md` in the repo. Steps 4–6 walk you through Google, Microsoft, and LinkedIn. Each takes 5 minutes.

All three use the same redirect URL:
```
https://zaabjfnapioewdnusvvl.supabase.co/auth/v1/callback
```

After enabling each in Supabase Dashboard → **Authentication → Providers**:
- Set the matching env var to `true` in Hostinger (`NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true`, etc.)
- Restart the Node app
- The button appears on `/auth/login`

---

## Step 4 — Critical Supabase URL config

Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://YOUR-LIVE-DOMAIN` (your Hostinger URL, with `https://`)
- **Redirect URLs** (add both, one per line):
  ```
  https://YOUR-LIVE-DOMAIN/auth/callback
  http://localhost:3000/auth/callback
  ```

Without this, OAuth bounces back to `localhost`.

---

## Step 5 — Smoke test

After deploy:

1. `https://YOUR-LIVE-DOMAIN/api/health` → `{"ok": true}`
2. `/auth/login` → renders cleanly; OAuth buttons appear only for enabled providers
3. Sign up with email → check inbox → confirm → land on `/dashboard`
4. Create a CV → save → click **Share publicly** → open the link in incognito → renders
5. `/cover-letters` → New → fill role → **Generate with AI** → letter drafts
6. `/applications` → Add → status filter works
7. `/templates` → Gallery renders

---

## Useful Supabase links

- Project dashboard: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl
- API keys: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/settings/api-keys
- Auth providers: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/providers
- URL config: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/url-configuration
- SQL editor: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/sql/new
- Database tables: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/editor
- Logs: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/logs/explorer

---

## What I couldn't do from here

- **GitHub push** — needs interactive `gh auth login` (browser flow). One command on your side: `gh repo create cvcraft --public --source=. --remote=origin --push`.
- **Hostinger env update** — no Hostinger API connector exposed. Paste the env vars from Step 2.
- **Supabase OAuth provider config** — requires the OAuth client credentials from Google/Azure/LinkedIn. AUTH_SETUP.md walks you through.

Everything else (project creation, all migrations, RLS, indexes, advisors) is done.
