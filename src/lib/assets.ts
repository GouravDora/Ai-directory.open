import { isSupabaseConfigured, supabase } from './supabase';
import type { SubmissionInput } from './submissions';
import type { PluginInput } from './plugins';

export interface DirectoryStats {
  indexedAssets: number;
  toolsTracked: number;
}

const EMPTY_STATS: DirectoryStats = { indexedAssets: 0, toolsTracked: 0 };

function asCount(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export async function fetchDirectoryStats(): Promise<DirectoryStats> {
  if (!isSupabaseConfigured) return EMPTY_STATS;

  const [subCount, pluginCount, subs, plugins] = await Promise.all([
    supabase.from('submissions').select('id', { count: 'exact', head: true }),
    supabase.from('plugins').select('id', { count: 'exact', head: true }),
    supabase.from('submissions').select('submitted_by'),
    supabase.from('plugins').select('submitted_by'),
  ]);

  if (subCount.error || pluginCount.error) {
    console.warn(
      '[assets] count failed:',
      subCount.error?.message ?? pluginCount.error?.message,
    );
    return EMPTY_STATS;
  }

  const indexedAssets = asCount(subCount.count) + asCount(pluginCount.count);

  const uniqueAuthors = new Set<string>();
  for (const row of (subs.data ?? [])) {
    const v = (row.submitted_by ?? '').trim().toLowerCase();
    if (v) uniqueAuthors.add(v);
  }
  for (const row of (plugins.data ?? [])) {
    const v = (row.submitted_by ?? '').trim().toLowerCase();
    if (v) uniqueAuthors.add(v);
  }
  const toolsTracked = uniqueAuthors.size || indexedAssets;

  return { indexedAssets, toolsTracked };
}

export async function insertAssetRecord(
  input: SubmissionInput & { logo_url?: string },
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('assets').insert({
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    category: input.category,
    accent: input.accent,
    icon_name: input.icon_name,
    system_prompt: input.system_prompt,
    framework_rules: input.framework_rules,
    mcp_connection_string: input.mcp_connection_string,
    submitted_by: input.submitted_by,
    is_open_source: input.is_open_source,
    logo_url: input.logo_url?.trim() || null,
  });
  if (error) console.warn('[assets] insert failed:', error.message);
}

export async function insertPluginAssetRecord(input: PluginInput & { logo_url?: string }): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('assets').insert({
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    category: 'Plugin',
    accent: 'green',
    icon_name: input.icon_name,
    system_prompt: input.system_prompt,
    framework_rules: input.framework_rules,
    mcp_connection_string: input.mcp_connection_string,
    submitted_by: input.submitted_by,
    is_open_source: input.is_open_source,
    logo_url: input.logo_url?.trim() || null,
  });
  if (error) console.warn('[assets] plugin insert failed:', error.message);
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
