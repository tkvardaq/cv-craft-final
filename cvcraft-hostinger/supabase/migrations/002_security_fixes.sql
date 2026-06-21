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
