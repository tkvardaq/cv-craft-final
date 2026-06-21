# CvCRAFT — Final Production Deploy

Everything below is verified working against the live Supabase project
`zaabjfnapioewdnusvvl` (eu-west-2, London).

## ✅ What's done and tested

- **Backend**: 8 tables, full RLS, auth schema, triggers. Security advisors clean.
- **Signup tested live**: creating a user auto-creates their profile (3 free credits). ✔
- **Login page**: fully rebuilt to industry standard (Google/Facebook quality):
  - Sign in / Sign up tab switcher
  - Show/hide password toggle
  - Live password-strength meter + requirement checklist
  - Inline email validation
  - Forgot-password flow → reset-password page
  - Social buttons (Google/Microsoft) that appear only when enabled
  - Full loading + error/success states, accessible labels
- **Password reset**: request link → email → `/auth/reset-password` → set new password. ✔

## 🔴 3 things YOU must do for it to work live

### 1. Point Hostinger at the NEW Supabase project
The live site currently shows `supabase: false` because env vars still point at the old (deleted) project. In Hostinger → Node.js → Environment variables, set:

```
NEXT_PUBLIC_SUPABASE_URL=https://zaabjfnapioewdnusvvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphYWJqZm5hcGlvZXdkbnVzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTI2NDQsImV4cCI6MjA5NDc2ODY0NH0.1EPW5GfwrTFdHWfBThhuLMFKvYePaysqSqvaP32TfiU
SUPABASE_SERVICE_ROLE_KEY=<from dashboard → Settings → API keys → secret>
NEXT_PUBLIC_SITE_URL=https://darksalmon-donkey-300892.hostingersite.com
NODE_ENV=production
NIM_API_KEY=<your existing NVIDIA NIM key>
```
Service-role key: https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/settings/api-keys

Then **Restart** the Node app. Verify: `curl https://darksalmon-donkey-300892.hostingersite.com/api/health` → `"supabase": true`.

### 2. Set Supabase auth URLs
https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/url-configuration
- **Site URL**: `https://darksalmon-donkey-300892.hostingersite.com`
- **Redirect URLs** (add both):
  ```
  https://darksalmon-donkey-300892.hostingersite.com/auth/callback
  https://darksalmon-donkey-300892.hostingersite.com/auth/reset-password
  ```

### 3. Decide on email confirmation (IMPORTANT)
Signup works, but Supabase has **"Confirm email" ON** by default. With Supabase's built-in email sender this is rate-limited (~2–3 emails/hour) — so at any real volume, confirmation emails won't arrive and users will think signup is broken.

**Pick one:**

- **Fastest (test/launch now):** Turn OFF email confirmation.
  https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/providers → Email → toggle **Confirm email** OFF → Save.
  Now signups log in instantly. (Less secure — anyone can sign up with any email — but fine for early launch.)

- **Production-correct:** Keep confirmation ON, but add a real email provider so messages actually deliver.
  https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/templates → SMTP Settings → plug in **Resend** (free tier, 5 min setup). Then confirmation + password-reset emails deliver reliably.

## 🟡 Optional: Google / Microsoft sign-in

These buttons are wired and will appear the moment you enable them. They need OAuth credentials that **only you can create** (they require your Google/Microsoft account):

1. Follow `AUTH_SETUP.md` Sections 4–5 (create the OAuth app, ~5 min each).
2. Enable the provider in https://supabase.com/dashboard/project/zaabjfnapioewdnusvvl/auth/providers
3. Add `NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true` (and/or `NEXT_PUBLIC_OAUTH_AZURE_ENABLED=true`) in Hostinger.
4. Restart. Buttons appear and work.

Until then, email/password is fully functional and the social buttons stay hidden (no broken UI).

## Upload

Use `cvcraft-hostinger.zip`. Extract so `package.json` is at the app root. Build = `npm install && npm run build`, Start = `npm start`, Node ≥ 20.
