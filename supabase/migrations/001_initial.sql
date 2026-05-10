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
