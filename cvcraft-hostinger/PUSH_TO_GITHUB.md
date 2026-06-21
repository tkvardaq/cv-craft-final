# Push to GitHub

The git repo is already initialised with a clean first commit. Two ways to push it to a new GitHub repo:

## Option A — `gh` CLI (one command)

If you have the [GitHub CLI](https://cli.github.com/) installed:

```bash
cd cvcraft-source
gh auth login        # if not already authenticated
gh repo create cvcraft --public --source=. --remote=origin --push
```

Done. Your repo is live at `https://github.com/<your-username>/cvcraft`.

## Option B — GitHub Web UI + two commands

1. Open https://github.com/new
2. Repository name: `cvcraft`
3. Visibility: **Public** (or Private — your choice)
4. **Do NOT** initialise with README, .gitignore, or licence — the local repo already has them.
5. Click **Create repository**.
6. Copy the URL GitHub shows (e.g. `https://github.com/your-username/cvcraft.git`).
7. In your terminal:

```bash
cd cvcraft-source
git remote add origin https://github.com/your-username/cvcraft.git
git push -u origin main
```

If prompted for credentials use a [Personal Access Token](https://github.com/settings/tokens) as the password (not your account password — GitHub disabled that years ago).

## Verify

After pushing, your repo should contain:

- `src/` — the full Next.js 16 app
- `supabase/migrations/` — all numbered migrations
- `supabase/all-in-one-setup.sql` — paste-once setup file
- `AUTH_SETUP.md` — OAuth provider walkthrough
- `DEPLOYMENT.md` — Hostinger deploy steps
- `README.md` — project overview
- `.env.example` — every env var you need

## Connect Hostinger to GitHub (optional but recommended)

If Hostinger supports git deploys on your plan:

1. Hostinger hPanel → **Git** → **Create repository**.
2. Repository URL: paste your GitHub HTTPS URL.
3. Branch: `main`.
4. Build commands: `npm install && npm run build`.
5. Start command: `npm start`.
6. Every push to `main` → auto-deploy.

Otherwise: zip → upload, same as before.
