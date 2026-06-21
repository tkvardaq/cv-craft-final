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
