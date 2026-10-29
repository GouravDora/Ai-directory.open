/*
# Add public plugins, companies, and community member directories

1. New Tables
- `plugins` stores community-published AI plugins with install commands, repository links, prompts, rules, and MCP connection details.
- `companies` stores public AI company profiles that can be discovered and linked to plugins and members.
- `community_members` stores public member profiles and optional company affiliations.

2. Moderation and integrity
- `verified` and `is_approved` are server-owned fields with safe defaults and are not writable through the public Data API.
- Plugin and company slugs are unique case-insensitively.
- Upvotes are changed only through a controlled database function, not direct public updates.

3. Security
- RLS is enabled on all new tables.
- Public visitors can read published directory records and submit their own public entries.
- Public insert grants are restricted to user-content columns; moderation, verification, counters, and timestamps remain server-controlled.
- The public upvote function only increments a counter for an existing published plugin.

4. Important notes
- This app currently uses a public community model rather than account-owned records, so anon and authenticated visitors can browse and submit.
- Member profiles intentionally do not store email addresses in the public table.
*/

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  website_url text,
  logo_url text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_lower_key ON public.companies (lower(slug));
CREATE INDEX IF NOT EXISTS companies_created_at_idx ON public.companies (created_at DESC);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.companies FROM anon, authenticated;
GRANT SELECT ON TABLE public.companies TO anon, authenticated;
GRANT INSERT (name, slug, description, website_url, logo_url) ON TABLE public.companies TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_companies" ON public.companies;
CREATE POLICY "public_read_companies" ON public.companies FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_companies" ON public.companies;
CREATE POLICY "public_insert_companies" ON public.companies FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_companies" ON public.companies;
CREATE POLICY "public_update_companies" ON public.companies FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "public_delete_companies" ON public.companies;
CREATE POLICY "public_delete_companies" ON public.companies FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE IF NOT EXISTS public.community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  handle text NOT NULL,
  bio text NOT NULL,
  role text NOT NULL DEFAULT 'Builder',
  website_url text,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  avatar_initials text NOT NULL DEFAULT 'AI',
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_members_handle_lower_key ON public.community_members (lower(handle));
CREATE INDEX IF NOT EXISTS community_members_company_id_idx ON public.community_members (company_id);
CREATE INDEX IF NOT EXISTS community_members_created_at_idx ON public.community_members (created_at DESC);
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.community_members FROM anon, authenticated;
GRANT SELECT ON TABLE public.community_members TO anon, authenticated;
GRANT INSERT (display_name, handle, bio, role, website_url, company_id, avatar_initials) ON TABLE public.community_members TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_community_members" ON public.community_members;
CREATE POLICY "public_read_community_members" ON public.community_members FOR SELECT TO anon, authenticated USING (is_approved = true);
DROP POLICY IF EXISTS "public_insert_community_members" ON public.community_members;
CREATE POLICY "public_insert_community_members" ON public.community_members FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_community_members" ON public.community_members;
CREATE POLICY "public_update_community_members" ON public.community_members FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "public_delete_community_members" ON public.community_members;
CREATE POLICY "public_delete_community_members" ON public.community_members FOR DELETE TO anon, authenticated USING (false);

CREATE TABLE IF NOT EXISTS public.plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  plugin_type text NOT NULL DEFAULT 'AI Plugin',
  icon_name text NOT NULL DEFAULT 'Plug',
  system_prompt text NOT NULL,
  framework_rules text NOT NULL DEFAULT '',
  mcp_connection_string text NOT NULL DEFAULT '',
  install_command text NOT NULL,
  repository_url text,
  website_url text,
  submitted_by text NOT NULL DEFAULT 'Community',
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  upvotes integer NOT NULL DEFAULT 0,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS plugins_slug_lower_key ON public.plugins (lower(slug));
CREATE INDEX IF NOT EXISTS plugins_company_id_idx ON public.plugins (company_id);
CREATE INDEX IF NOT EXISTS plugins_created_at_idx ON public.plugins (created_at DESC);
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.plugins FROM anon, authenticated;
GRANT SELECT ON TABLE public.plugins TO anon, authenticated;
GRANT INSERT (name, slug, tagline, description, plugin_type, icon_name, system_prompt, framework_rules, mcp_connection_string, install_command, repository_url, website_url, submitted_by, company_id) ON TABLE public.plugins TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_plugins" ON public.plugins;
CREATE POLICY "public_read_plugins" ON public.plugins FOR SELECT TO anon, authenticated USING (is_approved = true);
DROP POLICY IF EXISTS "public_insert_plugins" ON public.plugins;
CREATE POLICY "public_insert_plugins" ON public.plugins FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_plugins" ON public.plugins;
CREATE POLICY "public_update_plugins" ON public.plugins FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "public_delete_plugins" ON public.plugins;
CREATE POLICY "public_delete_plugins" ON public.plugins FOR DELETE TO anon, authenticated USING (false);

CREATE OR REPLACE FUNCTION public.increment_plugin_upvote(row_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.plugins SET upvotes = upvotes + 1 WHERE id = row_id AND is_approved = true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_plugin_upvote(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_plugin_upvote(uuid) TO anon, authenticated;