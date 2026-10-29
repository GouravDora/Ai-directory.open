/*
# Custom logos for submitted assets and plugins

1. Schema
- Add `logo_url` to `assets`, `submissions`, and `plugins`.
- Empty/null means the UI falls back to the existing Lucide icon.

2. Security
- Re-grant insert so community publishes can include `logo_url`.
*/

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS logo_url text;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS logo_url text;

ALTER TABLE public.plugins
  ADD COLUMN IF NOT EXISTS logo_url text;

REVOKE INSERT ON TABLE public.assets FROM anon, authenticated;
GRANT INSERT (
  name, tagline, description, category, accent, icon_name, system_prompt,
  framework_rules, mcp_connection_string, submitted_by, is_open_source, logo_url
) ON TABLE public.assets TO anon, authenticated;

REVOKE INSERT ON TABLE public.submissions FROM anon, authenticated;
GRANT INSERT (
  name, tagline, description, category, accent, icon_name, system_prompt,
  framework_rules, mcp_connection_string, submitted_by, is_open_source, logo_url
) ON TABLE public.submissions TO anon, authenticated;

REVOKE INSERT ON TABLE public.plugins FROM anon, authenticated;
GRANT INSERT (
  name, slug, tagline, description, plugin_type, icon_name, system_prompt,
  framework_rules, mcp_connection_string, install_command, repository_url,
  website_url, submitted_by, company_id, is_open_source, logo_url
) ON TABLE public.plugins TO anon, authenticated;
