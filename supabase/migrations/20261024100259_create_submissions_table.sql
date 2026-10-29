/*
# Create submissions table (base, public community directory)

1. New Tables
- `submissions` stores community-published AI integration assets (rules, MCPs, prompts).
  - Columns: id, name, tagline, description, category, accent, icon_name, system_prompt, framework_rules, mcp_connection_string, upvotes, submitted_by, created_at.

2. Security
- RLS enabled on `submissions`.
- Public visitors (anon + authenticated) can read submissions and submit new ones.
- User-content columns are insertable; upvotes and timestamps remain database-controlled.
- Upvotes are changed only through a server-controlled SECURITY DEFINER function (added in a later migration).
*/

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'IDE',
  accent text NOT NULL DEFAULT 'green',
  icon_name text NOT NULL DEFAULT 'Sparkles',
  system_prompt text NOT NULL,
  framework_rules text NOT NULL DEFAULT '',
  mcp_connection_string text NOT NULL DEFAULT '',
  upvotes integer NOT NULL DEFAULT 0,
  submitted_by text NOT NULL DEFAULT 'Anonymous',
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON public.submissions (created_at DESC);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.submissions FROM anon, authenticated;
GRANT SELECT ON TABLE public.submissions TO anon, authenticated;
GRANT INSERT (name, tagline, description, category, accent, icon_name, system_prompt, framework_rules, mcp_connection_string, submitted_by)
  ON TABLE public.submissions TO anon, authenticated;

DROP POLICY IF EXISTS "read_all_submissions" ON public.submissions;
CREATE POLICY "read_all_submissions"
  ON public.submissions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "insert_any_submission" ON public.submissions;
CREATE POLICY "insert_any_submission"
  ON public.submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "deny_submission_updates" ON public.submissions;
CREATE POLICY "deny_submission_updates"
  ON public.submissions FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "deny_submission_deletes" ON public.submissions;
CREATE POLICY "deny_submission_deletes"
  ON public.submissions FOR DELETE
  TO anon, authenticated
  USING (false);
