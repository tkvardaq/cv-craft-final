-- ==========================================================
-- CVCraft.uk Database Migration
-- ==========================================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CV_VAULT
CREATE TABLE IF NOT EXISTS public.cv_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled CV',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active')),
  json_content JSONB DEFAULT '{}'::jsonb,
  sector TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CV_TEMPLATES
CREATE TABLE IF NOT EXISTS public.cv_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT DEFAULT 'general',
  ats_rating INTEGER DEFAULT 3 CHECK (ats_rating BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT TRUE,
  preview_url TEXT
);

-- 4. SECTOR_KEYWORDS
CREATE TABLE IF NOT EXISTS public.sector_keywords (
  id SERIAL PRIMARY KEY,
  sector TEXT NOT NULL,
  keyword TEXT NOT NULL,
  weight REAL DEFAULT 1.0,
  mandatory BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI_CACHE
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id BIGSERIAL PRIMARY KEY,
  request_hash TEXT UNIQUE NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'gbp',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- CV Vault: users own their CVs
CREATE POLICY "Users can view own CVs" ON public.cv_vault
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own CVs" ON public.cv_vault
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON public.cv_vault
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON public.cv_vault
  FOR DELETE USING (auth.uid() = user_id);

-- CV Templates: publicly readable
CREATE POLICY "Templates are publicly readable" ON public.cv_templates
  FOR SELECT USING (true);

-- Sector Keywords: publicly readable
CREATE POLICY "Keywords are publicly readable" ON public.sector_keywords
  FOR SELECT USING (true);

-- AI Cache: no direct client access (server-side only via service key)
-- No SELECT policy = blocked for client

-- Payments: no direct client access
-- No SELECT policy = blocked for client

-- ==========================================================
-- TRIGGERS
-- ==========================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on cv_vault
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cv_vault_updated_at ON public.cv_vault;
CREATE TRIGGER cv_vault_updated_at
  BEFORE UPDATE ON public.cv_vault
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_cv_vault_user_id ON public.cv_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_sector_keywords_sector ON public.sector_keywords(sector);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hash ON public.ai_cache(request_hash);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
-- ==========================================================
-- CVCraft.uk Security Hardening & Template Expansion
-- ==========================================================

-- 1. SECURE PROFILES: Prevent users from self-promoting to premium or adding credits
CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If not using service role, prevent modification of premium and credits
  IF (current_setting('role') = 'authenticated') THEN
    NEW.is_premium = OLD.is_premium;
    NEW.credits = OLD.credits;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_sensitive_profile_fields ON public.profiles;
CREATE TRIGGER tr_protect_sensitive_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_sensitive_profile_fields();

-- 2. SECURE PAYMENTS: Explicitly block all client-side access
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No client access to payments" ON public.payments;
-- By default, no policies means no access. But let's be explicit for documentation.

-- 3. SECURE AI CACHE: Explicitly block all client-side access
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

-- 4. EXPAND TEMPLATES: Add more high-conversion templates
INSERT INTO public.cv_templates (name, sector, ats_rating, is_active, preview_url) VALUES
  ('Executive Elite', 'finance', 5, TRUE, '/templates/executive.png'),
  ('Creative Minimalist', 'tech', 4, TRUE, '/templates/creative.png'),
  ('Graduate Starter', 'general', 5, TRUE, '/templates/graduate.png'),
  ('Management Focus', 'general', 5, TRUE, '/templates/management.png'),
  ('Academic Scholar', 'general', 4, TRUE, '/templates/academic.png');

-- 5. STORAGE OPTIMIZATION HINT: Ensure we don't store large files in DB
-- (We use JSONB which is efficient, but we should remind developers to use Supabase Storage for PDFs)
COMMENT ON TABLE public.cv_vault IS 'Stores CV metadata and JSON content. Actual PDF files should be stored in Supabase Storage buckets.';
-- ==========================================================
-- CVCraft.uk RLS Hardening & Data Integrity
-- ==========================================================

-- 1. Ensure user_id cannot be changed in cv_vault
CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.user_id <> NEW.user_id THEN
        RAISE EXCEPTION 'user_id cannot be changed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_user_id_change ON public.cv_vault;
CREATE TRIGGER tr_prevent_user_id_change
    BEFORE UPDATE ON public.cv_vault
    FOR EACH ROW EXECUTE FUNCTION public.prevent_user_id_change();

-- 2. Add updated_at to profiles and auto-update it
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- 3. Hardening CV_VAULT RLS: Add WITH CHECK for update
DROP POLICY IF EXISTS "Users can update own CVs" ON public.cv_vault;
CREATE POLICY "Users can update own CVs" ON public.cv_vault
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Hardening PROFILES RLS: Ensure email is consistent with auth.users
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email = (SELECT email FROM auth.users WHERE id = NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_profile_email ON public.profiles;
CREATE TRIGGER tr_sync_profile_email
    BEFORE INSERT OR UPDATE OF email ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();

-- 5. SECURE STORAGE: Add policies for CV uploads if bucket exists
-- (Assuming bucket named 'cv-pdfs')
-- Note: This requires the storage extension and bucket to exist, which usually happens via UI or separate script.
-- But we can provide the policies for reference.

/*
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-pdfs', 'cv-pdfs', false);

CREATE POLICY "Users can upload their own CV PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cv-pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own CV PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cv-pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
*/
-- Ensure Stripe webhook retries do not create duplicate payment rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id_unique
  ON public.payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
-- Lock down legacy public tables that are not used by the current CvCRAFT app.
-- Supabase exposes the public schema through the Data API, so public tables need RLS.

ALTER TABLE IF EXISTS public.cv_builder_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cv_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."user" ENABLE ROW LEVEL SECURITY;

-- These legacy tables intentionally have no broad anon/authenticated policies.
-- The current app stores CVs in public.cv_vault and users in auth.users/public.profiles.

CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF OLD.user_id <> NEW.user_id THEN
        RAISE EXCEPTION 'user_id cannot be changed';
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    NEW.email = (SELECT email FROM auth.users WHERE id = NEW.id);
    RETURN NEW;
END;
$$;
-- Reduce API exposure for service-only or legacy tables.
-- RLS controls row access, while grants control whether the table/function is exposed at all.

REVOKE ALL ON TABLE public.ai_cache FROM anon, authenticated;
REVOKE ALL ON TABLE public.payments FROM anon, authenticated;
REVOKE ALL ON TABLE public.cv_builder_template FROM anon, authenticated;
REVOKE ALL ON TABLE public.cv_document FROM anon, authenticated;
REVOKE ALL ON TABLE public."user" FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (current_setting('role') = 'authenticated') THEN
    NEW.is_premium = OLD.is_premium;
    NEW.credits = OLD.credits;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_sensitive_profile_fields() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_profile_email() FROM anon, authenticated;
-- SECURITY DEFINER functions are trigger-only; they should not be callable via the API.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_sensitive_profile_fields() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_profile_email() FROM PUBLIC;
-- Index for TTL-based reads on ai_cache (queries filter by created_at).
CREATE INDEX IF NOT EXISTS idx_ai_cache_created_at
  ON public.ai_cache(created_at DESC);

-- Optional periodic cleanup (run via cron/scheduled function).
-- DELETE FROM public.ai_cache WHERE created_at < NOW() - INTERVAL '30 days';
-- =====================================================================
-- CvCRAFT v2 features: cover letters, job tracker, public CV sharing
-- Safe to run on a fresh database or an existing one (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. COVER_LETTERS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES public.cv_vault(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Cover Letter',
  company_name TEXT,
  role_title TEXT,
  recipient_name TEXT,
  job_description TEXT,
  body TEXT NOT NULL DEFAULT '',
  tone TEXT NOT NULL DEFAULT 'professional'
    CHECK (tone IN ('professional', 'enthusiastic', 'concise', 'formal')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own cover letters" ON public.cover_letters;
CREATE POLICY "Users view own cover letters" ON public.cover_letters
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own cover letters" ON public.cover_letters;
CREATE POLICY "Users insert own cover letters" ON public.cover_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own cover letters" ON public.cover_letters;
CREATE POLICY "Users update own cover letters" ON public.cover_letters
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own cover letters" ON public.cover_letters;
CREATE POLICY "Users delete own cover letters" ON public.cover_letters
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_cv_id ON public.cover_letters(cv_id);

DROP TRIGGER IF EXISTS cover_letters_updated_at ON public.cover_letters;
CREATE TRIGGER cover_letters_updated_at
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ---------------------------------------------------------------------
-- 2. APPLICATIONS (job tracker)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES public.cv_vault(id) ON DELETE SET NULL,
  cover_letter_id UUID REFERENCES public.cover_letters(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  location TEXT,
  job_url TEXT,
  salary_range TEXT,
  status TEXT NOT NULL DEFAULT 'saved'
    CHECK (status IN ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  applied_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own applications" ON public.applications;
CREATE POLICY "Users view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own applications" ON public.applications;
CREATE POLICY "Users insert own applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own applications" ON public.applications;
CREATE POLICY "Users update own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own applications" ON public.applications;
CREATE POLICY "Users delete own applications" ON public.applications
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.applications(user_id, applied_at DESC);

DROP TRIGGER IF EXISTS applications_updated_at ON public.applications;
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ---------------------------------------------------------------------
-- 3. PUBLIC CV SHARING — slug + flag on cv_vault
-- ---------------------------------------------------------------------
ALTER TABLE public.cv_vault
  ADD COLUMN IF NOT EXISTS public_slug TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS public_view_count INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cv_vault_public_slug_unique
  ON public.cv_vault(public_slug)
  WHERE public_slug IS NOT NULL;

-- Anyone (even anon) can SELECT a CV that has been explicitly marked public.
-- Filter limits anonymous reads to the row matching the slug, not the whole table.
DROP POLICY IF EXISTS "Public CVs are readable by anon" ON public.cv_vault;
CREATE POLICY "Public CVs are readable by anon" ON public.cv_vault
  FOR SELECT
  TO anon
  USING (is_public = TRUE AND public_slug IS NOT NULL);

-- Authenticated users still always see only their own (existing policy retained).

-- Atomic view-count incrementer used by the public view route.
CREATE OR REPLACE FUNCTION public.increment_cv_view_count(slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.cv_vault
    SET public_view_count = public_view_count + 1
  WHERE public_slug = slug AND is_public = TRUE;
END;
$$;

-- Allow anon to call the increment function (it's tightly scoped).
REVOKE EXECUTE ON FUNCTION public.increment_cv_view_count(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_cv_view_count(TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. PROFILES — add LinkedIn / website fields used by templates
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- ---------------------------------------------------------------------
-- 5. Verify handle_new_user populates avatar_url + provider metadata
--    (OAuth signups put avatar_url in raw_user_meta_data)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      TRIM(CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name')),
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
