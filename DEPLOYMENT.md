# CvCRAFT Deployment Guide 🚀

This guide explains how to deploy **CvCRAFT** to Hostinger (VPS or Node.js hosting) and set up the necessary integrations.

## 1. Prerequisites
- A **Hostinger** account (VPS with Ubuntu 22.04+ or Node.js hosting).
- A **Supabase** project (Free tier is fine).
- An **NVIDIA NIM** API Key (for AI features).
- A **Stripe** account (for payments).

## 2. Supabase Setup (The "Vault")
CvCRAFT uses Supabase for secure data storage with low overhead.
1. Create a new project on [Supabase](https://supabase.com).
2. Run the following SQL in the SQL Editor to set up the schema:
   ```sql
   -- Users Profiles
   create table profiles (
     id uuid references auth.users on delete cascade primary key,
     full_name text,
     is_premium boolean default false,
     updated_at timestamp with time zone default now()
   );

   -- CV Storage (Low storage JSON format)
   create table cv_vault (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users on delete cascade,
     json_content jsonb not null,
     status text default 'draft',
     updated_at timestamp with time zone default now()
   );

   -- AI Cache (Saves API costs)
   create table ai_cache (
     id uuid default gen_random_uuid() primary key,
     request_hash text unique,
     response jsonb,
     created_at timestamp with time zone default now()
   );
   ```
3. Enable **RLS** (Row Level Security) and add policies so users can only see their own data.

## 3. Environment Variables
Create a `.env` file on your server (or add them to Hostinger's environment settings):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI (NVIDIA NIM)
NIM_API_KEY=nvapi-your-key

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 4. Packaging for Hostinger
We've included a script to make this easy. On your local machine, run:
```powershell
./package-for-hostinger.ps1
```
This will create `cvcraft-deploy.zip`.

## 5. Hostinger Deployment (VPS)
1. **Upload**: Use SFTP to upload `cvcraft-deploy.zip` to your VPS.
2. **Extract**: `unzip cvcraft-deploy.zip -d ~/cvcraft`
3. **Install PM2**: `npm install -g pm2`
4. **Start**:
   ```bash
   cd ~/cvcraft
   pm2 start server.js --name cvcraft
   ```
5. **Nginx**: Set up a reverse proxy to forward port 80/443 to port 3000.

## 6. Hostinger Deployment (Node.js Hosting)
1. Upload the contents of the `deploy_package` folder (created by the script) directly to your `public_html` or the specified Node.js directory.
2. Set the "Entry Point" to `server.js`.
3. Add the environment variables in the Hostinger Panel.

## 7. AI & Storage Optimization
- **Low Storage**: CvCRAFT does not store PDF files. It generates them on-the-fly from JSON data. This keeps your database small and fast.
- **AI Efficiency**: The `ai_cache` table prevents redundant AI calls for the same job descriptions, saving you money on API tokens.

---
**CvCRAFT** - Premium Career Engineering
Built with Precision.
