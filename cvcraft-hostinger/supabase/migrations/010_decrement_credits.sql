-- Migration: 010_decrement_credits.sql
-- Function to safely decrement user credits atomically to prevent race conditions

CREATE OR REPLACE FUNCTION decrement_credits(user_id uuid, amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Lock the row for update to prevent concurrent modifications
  SELECT credits INTO current_credits
  FROM profiles
  WHERE id = user_id
  FOR UPDATE;

  -- Ensure user has enough credits
  IF current_credits IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF current_credits < amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Perform the atomic decrement
  UPDATE profiles
  SET credits = credits - amount,
      updated_at = NOW()
  WHERE id = user_id
  RETURNING credits INTO current_credits;

  RETURN current_credits;
END;
$$;
