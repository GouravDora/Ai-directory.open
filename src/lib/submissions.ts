import { supabase, isSupabaseConfigured } from './supabase';
import { insertAssetRecord } from './assets';
import { type IntegrationAsset, type AssetCategory } from '@/data/integrations';
import {
  Sparkles, Zap, Wind, Bot, Hexagon, Headphones, ShoppingCart, MousePointerClick,
  Terminal, FileCode, Cable, Code, Code2, Brain, Cpu, MessageSquare, Boxes,
  Plug, Webhook, Server, Cloud, GitBranch, Rocket, Wand2, Layers, Command,
  Globe, Network, Workflow, SquareTerminal,
  type LucideIcon,
} from 'lucide-react';

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Sparkles, Zap, Wind, Bot, Hexagon, Headphones, ShoppingCart, MousePointerClick,
  Terminal, FileCode, Cable, Code, Code2, Brain, Cpu, MessageSquare, Boxes,
  Plug, Webhook, Server, Cloud, GitBranch, Rocket, Wand2, Layers, Command,
  Globe, Network, Workflow, SquareTerminal,
};

export interface SubmissionRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AssetCategory;
  accent: 'green' | 'purple';
  icon_name: string;
  system_prompt: string;
  framework_rules: string;
  mcp_connection_string: string;
  upvotes: number;
  submitted_by: string;
  is_open_source?: boolean;
  logo_url?: string | null;
  assets_id?: string | null;
  created_at: string;
}

export interface SubmissionInput {
  name: string;
  tagline: string;
  description: string;
  category: AssetCategory;
  accent: 'green' | 'purple';
  icon_name: string;
  system_prompt: string;
  framework_rules: string;
  mcp_connection_string: string;
  submitted_by: string;
  is_open_source: boolean;
  logo_url?: string;
}

export function resolveIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] ?? ICON_REGISTRY.Sparkles;
}

export function rowToAsset(row: SubmissionRow): IntegrationAsset {
  return {
    id: `sub-${row.id}`,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    accent: row.accent,
    icon: resolveIcon(row.icon_name),
    upvotes: row.upvotes,
    isOpenSource: Boolean(row.is_open_source),
    systemPrompt: row.system_prompt,
    frameworkRules: row.framework_rules.split('\n').filter(Boolean),
    mcpConnectionString: row.mcp_connection_string,
    submittedBy: row.submitted_by,
    logoUrl: row.logo_url?.trim() || undefined,
    assetId: row.assets_id ?? undefined,
  };
}

export async function fetchSubmissions(): Promise<IntegrationAsset[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('submissions')
    .select('id,name,tagline,description,category,accent,icon_name,system_prompt,framework_rules,mcp_connection_string,upvotes,submitted_by,is_open_source,logo_url,created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[submissions] fetch failed:', error.message);
    return [];
  }
  return (data as SubmissionRow[]).map(rowToAsset);
}

export async function createSubmission(input: SubmissionInput): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn('[submissions] not configured — skipping persist');
    return false;
  }
  const payload = {
    ...input,
    logo_url: input.logo_url?.trim() || null,
  };
  const { error } = await supabase.from('submissions').insert(payload);
  if (error) {
    console.warn('[submissions] insert failed:', error.message);
    return false;
  }
  await insertAssetRecord(input);
  return true;
}

export async function incrementUpvote(remoteId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  // remoteId is the raw uuid (row.id), without the "sub-" prefix
  const { error } = await supabase.rpc('increment_submission_upvote', { row_id: remoteId });
  if (error) console.warn('[submissions] upvote failed:', error.message);
}
