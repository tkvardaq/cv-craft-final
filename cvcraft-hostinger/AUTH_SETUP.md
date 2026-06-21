# Authentication Setup — CvCRAFT

This walks you through enabling **Email + Password**, **Google**, **Microsoft**, and **LinkedIn** sign-in for your Supabase project. ~20 minutes end-to-end.

> The app **already** wires all four. You only need to (a) flip switches in Supabase, (b) paste OAuth credentials, (c) set env vars in Hostinger.

---

## Step 1 — Apply the database schema

In Supabase Dashboard → **SQL Editor** → New query:

1. Open `supabase/all-in-one-setup.sql` from this repo.
2. Paste the whole file into the editor.
3. Click **Run**.

You should see "Success. No rows returned." All tables, RLS policies, triggers, and the new `cover_letters` / `applications` tables + public-share columns are now live.

---

## Step 2 — Set the Site URL and redirect URLs

Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://your-domain.com` (your live Hostinger URL, with `https://`)
- **Redirect URLs** (add each on its own line):
  - `https://your-domain.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

Click **Save**.

---

## Step 3 — Email + Password (already on, just verify)

Supabase Dashboard → **Authentication** → **Providers** → **Email**:
- Toggle **Enable Email provider** → ON.
- Confirm "Confirm email" is ON for production (user must verify email).
- Save.

Optional: **Authentication → Templates** lets you customise the confirmation email.

Email + password signup will work immediately after this step.

---

## Step 4 — Google OAuth (Gmail accounts)

### 4a. Create Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a project (free).
2. Navigate to **APIs & Services → OAuth consent screen**:
   - User type: **External**
   - App name: `CvCRAFT`
   - User support email: your email
   - Authorised domains: add your Supabase project domain (e.g. `your-project.supabase.co`)
   - Save.
3. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: `CvCRAFT Web`
   - Authorised redirect URI:
     ```
     https://zaabjfnapioewdnusvvl.supabase.co/auth/v1/callback
     ```
     (find your project ref in Supabase **Project Settings → API**)
   - Click **Create**.
4. Copy the **Client ID** and **Client Secret**.

### 4b. Enable in Supabase

Supabase Dashboard → **Authentication → Providers → Google**:
- Toggle **Enable** → ON.
- Paste the Client ID and Client Secret.
- Save.

### 4c. Show the button on `/auth/login`

In Hostinger env vars, set:
```
NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true
```
Restart the Node app. The Google button now appears.

---

## Step 5 — Microsoft / Azure OAuth

### 5a. Register an Azure app

1. Go to [Azure Portal](https://portal.azure.com/) → **Microsoft Entra ID** → **App registrations** → **+ New registration**.
2. Name: `CvCRAFT`
3. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts** (most flexible).
4. Redirect URI → **Web**:
   ```
   https://zaabjfnapioewdnusvvl.supabase.co/auth/v1/callback
   ```
5. Click **Register**.
6. On the app overview page, copy the **Application (client) ID**.
7. Sidebar → **Certificates & secrets → + New client secret**. Copy the **Value** (not the ID).

### 5b. Enable in Supabase

Supabase Dashboard → **Authentication → Providers → Azure (Microsoft)**:
- Toggle **Enable** → ON.
- **Application (client) ID**: paste it.
- **Secret**: paste the secret value.
- **Tenant URL**: `https://login.microsoftonline.com/common` (for both personal + work accounts)
- Save.

### 5c. Show the button

```
NEXT_PUBLIC_OAUTH_AZURE_ENABLED=true
```
Restart.

---

## Step 6 — LinkedIn OAuth

### 6a. Create a LinkedIn Developer app

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/) → **Create app**.
2. App name: `CvCRAFT`. Pick a Company page (you can create a dummy one).
3. After creation, go to **Auth** tab.
4. Redirect URLs:
   ```
   https://zaabjfnapioewdnusvvl.supabase.co/auth/v1/callback
   ```
5. **Products** tab → request **Sign In with LinkedIn using OpenID Connect** (auto-approved usually).
6. Back on **Auth** tab, copy the **Client ID** and **Client Secret**.

### 6b. Enable in Supabase

Supabase Dashboard → **Authentication → Providers → LinkedIn (OIDC)**:
- Toggle **Enable** → ON.
- Paste Client ID + Secret.
- Save.

### 6c. Show the button

```
NEXT_PUBLIC_OAUTH_LINKEDIN_ENABLED=true
```

> The login page currently renders Google + Microsoft. If you want LinkedIn too, ask me to add the button — the provider key is `linkedin_oidc` in Supabase.

---

## Step 7 — Hostinger env vars (final list)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zaabjfnapioewdnusvvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production

# AI
NIM_API_KEY=nvapi-...

# OAuth (set to "true" after configuring each in Supabase)
NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_OAUTH_AZURE_ENABLED=true

# Stripe (optional, leave blank until ready)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Restart the Node app after saving env vars.

---

## Step 8 — Smoke test

Visit your site:

1. `/api/health` → should return `{"ok": true, ...}`.
2. `/auth/login` → form renders. OAuth buttons appear only for providers you set `..._ENABLED=true`.
3. Sign up with email → check inbox for confirmation → click link → land on `/dashboard`.
4. Sign in with Google (if enabled) → land on `/dashboard`.
5. Build a CV → click **Share publicly** → copy link → open in incognito → CV renders.
6. `/cover-letters` → create a new letter → click **Generate with AI** → letter drafts.
7. `/applications` → add a job → status filter works.

---

## Troubleshooting

- **"validation_failed: Unsupported provider"** — provider is not enabled in Supabase. Go to Auth → Providers and toggle it on.
- **"redirect_uri_mismatch"** — the redirect URI in Google/Azure/LinkedIn doesn't exactly match `https://zaabjfnapioewdnusvvl.supabase.co/auth/v1/callback`. Copy/paste, don't retype.
- **Confirmation email never arrives** — Supabase default SMTP is rate-limited. Configure a custom SMTP in **Authentication → Email Templates → SMTP settings** (use Resend, SendGrid, or Postmark — all have free tiers).
- **OAuth login lands back on /auth/login** — check Site URL and Redirect URLs in Step 2.
- **Build fails on Hostinger** — make sure `NEXT_PUBLIC_SITE_URL` includes `https://`. The code now tolerates bare hostnames but explicit is better.
