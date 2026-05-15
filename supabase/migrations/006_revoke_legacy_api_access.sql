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
