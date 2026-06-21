-- Index for TTL-based reads on ai_cache (queries filter by created_at).
CREATE INDEX IF NOT EXISTS idx_ai_cache_created_at
  ON public.ai_cache(created_at DESC);

-- Optional periodic cleanup (run via cron/scheduled function).
-- DELETE FROM public.ai_cache WHERE created_at < NOW() - INTERVAL '30 days';
