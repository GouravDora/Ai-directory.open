/*
# Secure per-user upvotes and upvote tracking

1. New Tables
- `upvotes`: records which signed-in account upvoted which asset.
  - Columns: user_id, asset_id, created_at. PK (user_id, asset_id).
  - asset_id references public.assets(id) (the unified catalog table).

2. Modified Tables
- `submissions` and `plugins` gain an `assets_id` column linking each entry to
  its matching `public.assets` row so upvote counters stay in sync.

3. Security
- RLS enabled on `upvotes`. Only the owner can read/insert/delete their own
  upvote rows (upvote history is private to the account).
- `secure_upvote_asset` is a SECURITY DEFINER function requiring authentication.
  It toggles a per-user upvote and keeps assets/submissions/plugins counters in
  sync. A user can only have one upvote row per asset (enforced by the PK).
- Legacy `increment_submission_upvote` / `increment_plugin_upvote` now also
  require authentication.
*/

CREATE TABLE IF NOT EXISTS public.upvotes (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);

CREATE INDEX IF NOT EXISTS upvotes_user_id_idx ON public.upvotes (user_id);
CREATE INDEX IF NOT EXISTS upvotes_asset_id_idx ON public.upvotes (asset_id);

ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.upvotes FROM anon, authenticated;
GRANT SELECT ON TABLE public.upvotes TO authenticated;
GRANT INSERT (user_id, asset_id) ON TABLE public.upvotes TO authenticated;
GRANT DELETE ON TABLE public.upvotes TO authenticated;

DROP POLICY IF EXISTS "owner_read_upvotes" ON public.upvotes;
CREATE POLICY "owner_read_upvotes" ON public.upvotes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_upvotes" ON public.upvotes;
CREATE POLICY "owner_insert_upvotes" ON public.upvotes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_upvotes" ON public.upvotes;
CREATE POLICY "owner_delete_upvotes" ON public.upvotes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_update_upvotes" ON public.upvotes;
CREATE POLICY "no_update_upvotes" ON public.upvotes FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

-- Link directory entries to the unified assets catalog.
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS assets_id uuid REFERENCES public.assets(id) ON DELETE SET NULL;
ALTER TABLE public.plugins ADD COLUMN IF NOT EXISTS assets_id uuid REFERENCES public.assets(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS submissions_assets_id_idx ON public.submissions (assets_id);
CREATE INDEX IF NOT EXISTS plugins_assets_id_idx ON public.plugins (assets_id);

-- Re-grant insert so `assets_id` can be supplied on new publishes.
REVOKE INSERT ON TABLE public.submissions FROM anon, authenticated;
GRANT INSERT (
  name, tagline, description, category, accent, icon_name, system_prompt,
  framework_rules, mcp_connection_string, submitted_by, is_open_source,
  logo_url, assets_id
) ON TABLE public.submissions TO anon, authenticated;

REVOKE INSERT ON TABLE public.plugins FROM anon, authenticated;
GRANT INSERT (
  name, slug, tagline, description, plugin_type, icon_name, system_prompt,
  framework_rules, mcp_connection_string, install_command, repository_url,
  website_url, submitted_by, company_id, is_open_source, logo_url, assets_id
) ON TABLE public.plugins TO anon, authenticated;

-- Backfill best-effort links for existing rows.
UPDATE public.submissions s SET assets_id = a.id
FROM public.assets a
WHERE s.assets_id IS NULL
  AND a.name = s.name
  AND a.submitted_by = s.submitted_by
  AND a.created_at = s.created_at;

UPDATE public.plugins p SET assets_id = a.id
FROM public.assets a
WHERE p.assets_id IS NULL
  AND a.name = p.name
  AND a.submitted_by = p.submitted_by
  AND a.created_at = p.created_at;

CREATE OR REPLACE FUNCTION public.secure_upvote_asset(p_asset_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_exists boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to upvote.';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.upvotes WHERE user_id = v_user_id AND asset_id = p_asset_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.upvotes WHERE user_id = v_user_id AND asset_id = p_asset_id;
    UPDATE public.assets SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = p_asset_id;
    UPDATE public.submissions SET upvotes = GREATEST(upvotes - 1, 0) WHERE assets_id = p_asset_id;
    UPDATE public.plugins SET upvotes = GREATEST(upvotes - 1, 0) WHERE assets_id = p_asset_id;
    RETURN 'unvoted';
  ELSE
    INSERT INTO public.upvotes (user_id, asset_id, created_at) VALUES (v_user_id, p_asset_id, now());
    UPDATE public.assets SET upvotes = upvotes + 1 WHERE id = p_asset_id;
    UPDATE public.submissions SET upvotes = upvotes + 1 WHERE assets_id = p_asset_id;
    UPDATE public.plugins SET upvotes = upvotes + 1 WHERE assets_id = p_asset_id;
    RETURN 'upvoted';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.secure_upvote_asset(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.secure_upvote_asset(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.increment_submission_upvote(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to upvote.';
  END IF;
  UPDATE public.submissions SET upvotes = upvotes + 1 WHERE id = row_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_submission_upvote(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_submission_upvote(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.increment_plugin_upvote(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to upvote.';
  END IF;
  UPDATE public.plugins SET upvotes = upvotes + 1 WHERE id = row_id AND is_approved = true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_plugin_upvote(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_plugin_upvote(uuid) TO authenticated;
