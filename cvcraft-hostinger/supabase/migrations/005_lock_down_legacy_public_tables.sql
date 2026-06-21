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
