import { isSupabaseConfigured, supabase } from './supabase';
import type { IntegrationAsset } from '@/data/integrations';
import { rowToAsset, type SubmissionRow } from './submissions';
import { rowToPluginAsset, type PluginRow } from './plugins';

export type AccountType = 'personal' | 'business';

export const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/;

export interface ProfileRow {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  account_type: AccountType;
  created_at: string;
}

export interface ProfileStats {
  assets: number;
  plugins: number;
  followers: number;
  following: number;
}

export interface ProfileEntry {
  key: string;
  asset: IntegrationAsset;
  createdAt: string;
}

export interface ProfileUpdate {
  username: string;
  display_name: string;
  bio: string;
  account_type: AccountType;
}

const SUBMISSION_COLUMNS =
  'id,name,tagline,description,category,accent,icon_name,system_prompt,framework_rules,mcp_connection_string,upvotes,submitted_by,is_open_source,logo_url,created_at';
const PLUGIN_COLUMNS =
  'id,name,slug,tagline,description,plugin_type,icon_name,system_prompt,framework_rules,mcp_connection_string,install_command,repository_url,website_url,submitted_by,upvotes,is_open_source,logo_url,created_at';

export async function fetchProfileByUsername(username: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id,username,display_name,bio,account_type,created_at')
    .eq('username', username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return data as ProfileRow;

  const displayGuess = username.replace(/-/g, ' ');
  const byName = await supabase
    .from('profiles')
    .select('id,username,display_name,bio,account_type,created_at')
    .ilike('display_name', displayGuess)
    .limit(1);
  if (byName.error) throw new Error(byName.error.message);
  return ((byName.data?.[0] as ProfileRow | undefined) ?? null);
}

async function countRows(table: string, filters: Record<string, string>): Promise<number> {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchProfileStats(profileId: string): Promise<ProfileStats> {
  const [assets, plugins, followers, following] = await Promise.all([
    countRows('submissions', { user_id: profileId }),
    countRows('plugins', { user_id: profileId }),
    countRows('follows', { following_id: profileId }),
    countRows('follows', { follower_id: profileId }),
  ]);
  return { assets, plugins, followers, following };
}

export async function fetchIsFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function followProfile(followerId: string, followingId: string): Promise<void> {
  const { error } = await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId });
  if (error) throw new Error(error.message);
}

export async function unfollowProfile(followerId: string, followingId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  if (error) throw new Error(error.message);
}

export async function fetchProfileEntries(userId: string): Promise<ProfileEntry[]> {
  const [submissions, plugins] = await Promise.all([
    supabase.from('submissions').select(SUBMISSION_COLUMNS).eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('plugins').select(PLUGIN_COLUMNS).eq('user_id', userId).order('created_at', { ascending: false }),
  ]);
  if (submissions.error) throw new Error(submissions.error.message);
  if (plugins.error) throw new Error(plugins.error.message);

  const submissionEntries = ((submissions.data ?? []) as SubmissionRow[]).map((row) => ({
    key: `sub-${row.id}`,
    asset: rowToAsset(row),
    createdAt: row.created_at,
  }));
  const pluginEntries = ((plugins.data ?? []) as PluginRow[]).map((row) => ({
    key: `plugin-${row.id}`,
    asset: rowToPluginAsset(row),
    createdAt: row.created_at,
  }));

  return [...submissionEntries, ...pluginEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOwnProfile(userId: string, update: ProfileUpdate): Promise<string | null> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (!error) return null;
  if (error.code === '23505') return 'That username is already taken. Try another one.';
  return 'We could not save your profile. Please try again.';
}
