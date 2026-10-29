import { type IntegrationAsset } from '@/data/integrations';
import { ICON_REGISTRY } from '@/lib/submissions';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { insertPluginAssetRecord } from '@/lib/assets';

export interface PluginRow {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  plugin_type: string;
  icon_name: string;
  system_prompt: string;
  framework_rules: string;
  mcp_connection_string: string;
  install_command: string;
  repository_url: string | null;
  website_url: string | null;
  submitted_by: string;
  upvotes: number;
  is_open_source?: boolean;
  logo_url?: string | null;
  created_at: string;
}

export interface PluginInput {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  plugin_type: string;
  icon_name: string;
  system_prompt: string;
  framework_rules: string;
  mcp_connection_string: string;
  install_command: string;
  repository_url: string;
  website_url: string;
  submitted_by: string;
  company_id: string | null;
  is_open_source: boolean;
  logo_url?: string;
}

function resolveIcon(name: string) {
  return ICON_REGISTRY[name] ?? ICON_REGISTRY.Plug;
}

export function rowToPluginAsset(row: PluginRow): IntegrationAsset {
  return {
    id: `plugin-${row.id}`,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: 'Plugin',
    icon: resolveIcon(row.icon_name),
    accent: 'green',
    upvotes: row.upvotes,
    isOpenSource: Boolean(row.is_open_source),
    systemPrompt: row.system_prompt,
    frameworkRules: row.framework_rules.split('\n').filter(Boolean),
    mcpConnectionString: row.mcp_connection_string,
    submittedBy: row.submitted_by,
    installCommand: row.install_command,
    repositoryUrl: row.repository_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    logoUrl: row.logo_url?.trim() || undefined,
  };
}

export async function fetchPlugins(): Promise<IntegrationAsset[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('plugins')
    .select('id,name,slug,tagline,description,plugin_type,icon_name,system_prompt,framework_rules,mcp_connection_string,install_command,repository_url,website_url,submitted_by,upvotes,is_open_source,logo_url,created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[plugins] fetch failed:', error.message);
    return [];
  }
  return (data as PluginRow[]).map(rowToPluginAsset);
}

export async function createPlugin(input: PluginInput): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const payload = {
    ...input,
    logo_url: input.logo_url?.trim() || null,
  };
  const { error } = await supabase.from('plugins').insert(payload);
  if (error) {
    console.warn('[plugins] insert failed:', error.message);
    return false;
  }
  await insertPluginAssetRecord(input);
  return true;
}

export async function incrementPluginUpvote(remoteId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc('increment_plugin_upvote', { row_id: remoteId });
  if (error) console.warn('[plugins] upvote failed:', error.message);
}
