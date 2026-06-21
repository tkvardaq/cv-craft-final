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
