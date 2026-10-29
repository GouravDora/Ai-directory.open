import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';
import type { IntegrationAsset } from '@/data/integrations';
<<<<<<< HEAD
import { assetRowToAsset, type AssetRow } from './upvotes';
=======
import { assetRowToAsset } from './upvotes';
>>>>>>> faf152f628abaf2f7a11486ccc1a232f0edc572d

const STACK_ASSET_COLUMNS =
  'id,name,tagline,description,category,accent,icon_name,system_prompt,framework_rules,mcp_connection_string,upvotes,submitted_by,is_open_source,logo_url,created_at';

export interface Stack {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface StackWithItems extends Stack {
  items: IntegrationAsset[];
  itemCount: number;
}

export async function fetchStacksByUser(userId: string): Promise<Stack[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('stacks')
    .select('id,user_id,name,description,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[stacks] fetch failed:', error.message);
    return [];
  }
  return (data ?? []) as Stack[];
}

export async function fetchStacksByUserWithItems(userId: string): Promise<StackWithItems[]> {
  if (!isSupabaseConfigured) return [];
  const stacks = await fetchStacksByUser(userId);
  const withItems = await Promise.all(stacks.map((s) => fetchStackWithItems(s.id)));
  return withItems.filter((s): s is StackWithItems => s !== null);
}

export function useStacks(userId: string, refreshKey: number) {
  const [stacks, setStacks] = useState<StackWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchStacksByUserWithItems(userId).then((result) => {
      if (active) { setStacks(result); setLoading(false); }
    });
    return () => { active = false; };
  }, [userId, refreshKey]);

  return { stacks, loading };
}

export async function fetchStackWithItems(stackId: string): Promise<StackWithItems | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('stacks')
    .select(
      `id,user_id,name,description,created_at,
      stack_items(
        asset_id,
        created_at,
        assets(${STACK_ASSET_COLUMNS})
      )`,
    )
    .eq('id', stackId)
    .maybeSingle();
  if (error) {
    console.warn('[stacks] fetch stack items failed:', error.message);
    return null;
  }
  if (!data) return null;

<<<<<<< HEAD
  const stack = (data as unknown) as Stack & {
    stack_items: Array<{ asset_id: string; created_at: string; assets: AssetRow | AssetRow[] | null }>;
  };
  const items = (stack.stack_items ?? [])
    .filter((si) => si.assets)
    .map((si) => {
      const assetRow = Array.isArray(si.assets) ? si.assets[0] : si.assets;
      if (!assetRow) return null;
      return assetRowToAsset(assetRow, si.asset_id);
    })
    .filter((a): a is IntegrationAsset => a !== null);
=======
  const stack = data as Stack & {
    stack_items: Array<{ asset_id: string; created_at: string; assets: { id: string } & Record<string, unknown> | null }>;
  };
  const items = (stack.stack_items ?? [])
    .filter((si) => si.assets)
    .map((si) => assetRowToAsset(si.assets as any, si.asset_id));
>>>>>>> faf152f628abaf2f7a11486ccc1a232f0edc572d

  return {
    id: stack.id,
    user_id: stack.user_id,
    name: stack.name,
    description: stack.description,
    created_at: stack.created_at,
    items,
    itemCount: items.length,
  };
}

export interface StackInput {
  name: string;
  description: string;
}

export async function createStack(userId: string, input: StackInput): Promise<Stack | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('stacks')
    .insert({ user_id: userId, name: input.name.trim(), description: input.description.trim() })
    .select('id,user_id,name,description,created_at')
    .single();
  if (error) {
    console.warn('[stacks] create failed:', error.message);
    return null;
  }
  return data as Stack;
}

export async function updateStack(stackId: string, userId: string, input: StackInput): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('stacks')
    .update({ name: input.name.trim(), description: input.description.trim() })
    .eq('id', stackId)
    .eq('user_id', userId);
  if (error) {
    console.warn('[stacks] update failed:', error.message);
    return false;
  }
  return true;
}

export async function deleteStack(stackId: string, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('stacks').delete().eq('id', stackId).eq('user_id', userId);
  if (error) {
    console.warn('[stacks] delete failed:', error.message);
    return false;
  }
  return true;
}

export async function addStackItem(stackId: string, userId: string, assetId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('stack_items').insert({ stack_id: stackId, asset_id: assetId });
  if (error) {
    console.warn('[stacks] add item failed:', error.message);
    return false;
  }
  return true;
}

export async function removeStackItem(stackId: string, userId: string, assetId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('stack_items')
    .delete()
    .eq('stack_id', stackId)
    .eq('asset_id', assetId);
  if (error) {
    console.warn('[stacks] remove item failed:', error.message);
    return false;
  }
  return true;
}
