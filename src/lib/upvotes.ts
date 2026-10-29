import { isSupabaseConfigured, supabase } from './supabase';
import type { IntegrationAsset } from '@/data/integrations';
import { resolveIcon } from './submissions';

const ASSET_COLUMNS =
  'id,name,tagline,description,category,accent,icon_name,system_prompt,framework_rules,mcp_connection_string,upvotes,submitted_by,is_open_source,logo_url,created_at';

<<<<<<< HEAD
export interface AssetRow {  id: string;
=======
interface AssetRow {
  id: string;
>>>>>>> faf152f628abaf2f7a11486ccc1a232f0edc572d
  name: string;
  tagline: string;
  description: string;
  category: string;
  accent: string;
  icon_name: string;
  system_prompt: string;
  framework_rules: string;
  mcp_connection_string: string;
  upvotes: number;
  submitted_by: string;
  is_open_source?: boolean;
  logo_url?: string | null;
  created_at: string;
}

export function assetRowToAsset(row: AssetRow, assetId: string): IntegrationAsset {
  return {
    id: `asset-${row.id}`,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category as IntegrationAsset['category'],
    accent: row.accent as 'green' | 'purple',
    icon: resolveIcon(row.icon_name),
    upvotes: row.upvotes,
    isOpenSource: Boolean(row.is_open_source),
    systemPrompt: row.system_prompt,
    frameworkRules: row.framework_rules.split('\n').filter(Boolean),
    mcpConnectionString: row.mcp_connection_string,
    submittedBy: row.submitted_by,
    logoUrl: row.logo_url?.trim() || undefined,
    assetId,
  };
}

export type UpvoteResult = 'upvoted' | 'unvoted';

export interface UpvotedAsset extends IntegrationAsset {
  upvotedAt: string;
}

export async function secureUpvoteAsset(assetId: string): Promise<UpvoteResult | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('secure_upvote_asset', { p_asset_id: assetId });
  if (error) {
    console.warn('[upvotes] secure upvote failed:', error.message);
    return null;
  }
  return (data as UpvoteResult | null) ?? null;
}

<<<<<<< HEAD
export async function fetchUserUpvotedAssets(userId: string): Promise<UpvotedAsset[]> {
=======
export async function fetchUserUpvotedAssets(userId: string): Promise<IntegrationAsset[]> {
>>>>>>> faf152f628abaf2f7a11486ccc1a232f0edc572d
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('upvotes')
    .select(`asset_id, created_at, assets(${ASSET_COLUMNS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[upvotes] fetch user upvoted assets failed:', error.message);
    return [];
  }
<<<<<<< HEAD
  const rows = (data as unknown) as Array<{ asset_id: string; created_at: string; assets: AssetRow | AssetRow[] | null }>;
  return rows
    .filter((r) => r.assets)
    .map((r) => {
      const assetRow = Array.isArray(r.assets) ? r.assets[0] : r.assets;
      if (!assetRow) return null;
      const asset = assetRowToAsset(assetRow, r.asset_id);
      return { ...asset, upvotedAt: r.created_at } as UpvotedAsset;
    })
    .filter((a): a is UpvotedAsset => a !== null);
=======
  const rows = (data ?? []) as Array<{ asset_id: string; created_at: string; assets: AssetRow | null }>;
  return rows
    .filter((r) => r.assets)
    .map((r) => {
      const asset = assetRowToAsset(r.assets!, r.asset_id);
      return { ...asset, upvotedAt: r.created_at } as UpvotedAsset;
    });
>>>>>>> faf152f628abaf2f7a11486ccc1a232f0edc572d
}

export interface UpvoteStatus {
  assetId: string;
  upvoted: boolean;
}

export async function fetchUpvoteStatus(assetIds: string[], userId: string): Promise<UpvoteStatus[]> {
  if (!isSupabaseConfigured || assetIds.length === 0) return [];
  const { data, error } = await supabase
    .from('upvotes')
    .select('asset_id')
    .eq('user_id', userId)
    .in('asset_id', assetIds);
  if (error) {
    console.warn('[upvotes] fetch upvote status failed:', error.message);
    return [];
  }
  const upvoted = new Set((data ?? []).map((r) => r.asset_id));
  return assetIds.map((id) => ({ assetId: id, upvoted: upvoted.has(id) }));
}
