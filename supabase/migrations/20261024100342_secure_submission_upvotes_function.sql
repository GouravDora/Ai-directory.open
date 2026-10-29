/*
# Secure public submission upvotes (function only)

1. Purpose
- Make submission upvotes use the same server-controlled increment pattern as plugins.
- The deny policies on update/delete already exist from the base submissions migration.

2. Security changes
- Add `increment_submission_upvote(uuid)` as a SECURITY DEFINER function with a fixed search path.
- The upvote function is intentionally callable by anon and authenticated because public visitors can upvote.
*/

CREATE OR REPLACE FUNCTION public.increment_submission_upvote(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.submissions
  SET upvotes = upvotes + 1
  WHERE id = row_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_submission_upvote(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_submission_upvote(uuid) TO anon, authenticated;