-- SECURITY DEFINER functions are trigger-only; they should not be callable via the API.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_sensitive_profile_fields() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_profile_email() FROM PUBLIC;
