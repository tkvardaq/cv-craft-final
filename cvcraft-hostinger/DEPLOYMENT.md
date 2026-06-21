# CvCRAFT Production Deployment

CvCRAFT must be deployed as a Node.js Next.js application. Do not use static export: the app depends on server route handlers, Supabase auth cookies, Stripe webhooks, and AI endpoints.

## Required Hostinger Plan

Use either:
- Hostinger Node.js hosting on a supported Business/Cloud plan.
- Hostinger VPS with Node.js 22 LTS, PM2, and nginx as a reverse proxy.

## Required Environment Variables

Set these in Hostinger's Node.js panel or in the server process environment:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://your-domain.com

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NIM_API_KEY=your-nvidia-nim-key

# Optional. Leave unset until payments are enabled.
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

`NEXT_PUBLIC_SITE_URL` must exactly match the production domain, without a trailing slash.

## Local Development

1. Copy `.env.example` to `.env.local`.
2. Replace every placeholder value with real Supabase, NVIDIA NIM, and Stripe test keys.
3. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

To test the production server locally:

```powershell
npm run build
npm run start
```

`npm run start` uses normal `next start`. If you need a different local port, run `$env:PORT=3001; npm run start`.

Open `http://localhost:3000/api/health` to confirm the app can see its environment variables and Supabase database. A `503` response means configuration is incomplete.

## Supabase Setup

1. Create a Supabase project.
2. Run every SQL migration in order from `supabase/migrations`.
3. In Supabase Auth settings, add these redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` for local development
4. Confirm RLS is enabled on `profiles`, `cv_vault`, `ai_cache`, and `payments`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it in client code.

## Stripe Setup

Stripe is optional. Leave these variables blank until you are ready to accept payments.

1. Create or use a Stripe account.
2. Add a webhook endpoint:
   - `https://your-domain.com/api/stripe/webhook`
3. Subscribe to:
   - `checkout.session.completed`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Use matching test keys for test mode or live keys for production.

## Build and Package

For Hostinger's framework-detecting app uploader, create a source package:

```powershell
.\package-source-for-hostinger.ps1
```

Upload `cvcraft-source.zip` when Hostinger asks for "app files" and validates the project structure. This package includes the source `src/app` directory at the zip root, so Hostinger can detect Next.js.

For this Hostinger source-upload flow, use:

```text
Build command: npm run build
Start command: npm run start
Entry point: leave blank if Hostinger manages it, otherwise use node_modules/next/dist/bin/next
```

The source package runs normal Next.js. Standalone output is only enabled by `package-for-hostinger.ps1`.

From this repository on Windows:

```powershell
.\package-for-hostinger.ps1
```

The script runs `npm run build`, copies the Next standalone server, copies `.next/static` and `public`, verifies the package, and creates `cvcraft-deploy.zip`.

The generated package is a prebuilt runtime artifact. Its `package.json` intentionally uses:

```json
"build": "node -e \"console.log('Prebuilt Next.js standalone package; skipping build.')\"",
"start": "node server.js"
```

That prevents Hostinger from running `next build` inside `deploy_package`, which would fail because the standalone artifact does not include the source `src/app` directory.

## Hostinger Node.js Hosting

1. Run `.\package-for-hostinger.ps1`.
2. Upload and extract `cvcraft-deploy.zip`, or upload the contents of `deploy_package`.
3. Set the entry point to `server.js`.
4. Set Node.js to version 22 LTS or another Hostinger-supported LTS version.
5. Add all required environment variables.
6. Set the start command to `npm run start` or `node server.js`.
7. Leave the build command blank if Hostinger allows it. If Hostinger requires a build command, use `npm run build`; in the generated package this only prints a prebuilt-package message and exits successfully.
8. Start or restart the app from hPanel.

Do not upload `cvcraft-deploy.zip` to Hostinger's framework-detecting app uploader. It is a prebuilt standalone runtime artifact and intentionally does not include `src/app`, so that uploader can reject it as an invalid project structure. Use `cvcraft-source.zip` for that flow.

## Hostinger VPS

```bash
unzip cvcraft-deploy.zip -d ~/cvcraft
cd ~/cvcraft
npm install -g pm2
PORT=3000 pm2 start server.js --name cvcraft
pm2 save
```

Configure nginx to proxy HTTPS traffic to `127.0.0.1:3000`, and set normal upload/body limits appropriate for 5 MB PDF uploads.

## Production Smoke Test

After deployment, verify:

- Home page loads.
- Email/password sign up and sign in work.
- OAuth callback lands on `/dashboard`.
- Creating a CV saves and redirects to `/builder?id=...`.
- Reopening a CV from dashboard loads existing content.
- Deleting a CV removes only the current user's CV.
- PDF download works.
- AI summary, JD analysis, PDF parse, and bullet rewrite require auth.
- If Stripe is enabled, test checkout redirects correctly and webhook upgrades the account.
- Server logs contain no missing environment variable errors.
- `/api/health` returns `200` with `ok: true`.
