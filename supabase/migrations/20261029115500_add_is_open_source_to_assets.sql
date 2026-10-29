/*
# Separate open source vs closed source assets

1. Schema
- Add `is_open_source` to `submissions` and `plugins` (the live directory records).
- Create `public.assets` with a boolean `is_open_source` column so the catalog can be queried as a single assets table.

2. Security
- Mirror the existing public-read / restricted-write model used by submissions.
- Grant insert on the new boolean for community publishes.
*/

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS is_open_source boolean NOT NULL DEFAULT false;

ALTER TABLE public.plugins
  ADD COLUMN IF NOT EXISTS is_open_source boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS submissions_is_open_source_idx ON public.submissions (is_open_source);
CREATE INDEX IF NOT EXISTS plugins_is_open_source_idx ON public.plugins (is_open_source);

REVOKE INSERT ON TABLE public.submissions FROM anon, authenticated;
GRANT INSERT (
  name, tagline, description, category, accent, icon_name, system_prompt,
  framework_rules, mcp_connection_string, submitted_by, is_open_source
) ON TABLE public.submissions TO anon, authenticated;

REVOKE INSERT ON TABLE public.plugins FROM anon, authenticated;
GRANT INSERT (
  name, slug, tagline, description, plugin_type, icon_name, system_prompt,
  framework_rules, mcp_connection_string, install_command, repository_url,
  website_url, submitted_by, company_id, is_open_source
) ON TABLE public.plugins TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'IDE',
  accent text NOT NULL DEFAULT 'green',
  icon_name text NOT NULL DEFAULT 'Sparkles',
  system_prompt text NOT NULL DEFAULT '',
  framework_rules text NOT NULL DEFAULT '',
  mcp_connection_string text NOT NULL DEFAULT '',
  upvotes integer NOT NULL DEFAULT 0,
  submitted_by text NOT NULL DEFAULT 'Anonymous',
  is_open_source boolean NOT NULL DEFAULT false,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assets_is_open_source_idx ON public.assets (is_open_source);
CREATE INDEX IF NOT EXISTS assets_created_at_idx ON public.assets (created_at DESC);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.assets FROM anon, authenticated;
GRANT SELECT ON TABLE public.assets TO anon, authenticated;
GRANT INSERT (
  name, tagline, description, category, accent, icon_name, system_prompt,
  framework_rules, mcp_connection_string, submitted_by, is_open_source
) ON TABLE public.assets TO anon, authenticated;

DROP POLICY IF EXISTS "read_all_assets" ON public.assets;
CREATE POLICY "read_all_assets"
  ON public.assets FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

DROP POLICY IF EXISTS "insert_any_asset" ON public.assets;
CREATE POLICY "insert_any_asset"
  ON public.assets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "deny_asset_updates" ON public.assets;
CREATE POLICY "deny_asset_updates"
  ON public.assets FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "deny_asset_deletes" ON public.assets;
CREATE POLICY "deny_asset_deletes"
  ON public.assets FOR DELETE
  TO anon, authenticated
  USING (false);
