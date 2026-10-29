import { type IntegrationAsset } from '@/data/integrations';

export interface ExportedAsset {
  name: string;
  tagline: string;
  description: string;
  category: string;
  accent: string;
  icon_name: string;
  system_prompt: string;
  framework_rules: string[];
  mcp_connection_string: string;
  upvotes: number;
  is_open_source: boolean;
  logo_url?: string;
}

/**
 * Builds a clean JSON representation of an integration asset for local use
 * (importing into another tool, sharing, or re-importing elsewhere).
 */
export function buildAssetJson(asset: IntegrationAsset): string {
  const payload: ExportedAsset = {
    name: asset.name,
    tagline: asset.tagline,
    description: asset.description,
    category: asset.category,
    accent: asset.accent,
    icon_name: asset.icon.displayName ?? asset.icon.name,
    system_prompt: asset.systemPrompt,
    framework_rules: asset.frameworkRules,
    mcp_connection_string: asset.mcpConnectionString,
    upvotes: asset.upvotes,
    is_open_source: asset.isOpenSource,
    ...(asset.logoUrl ? { logo_url: asset.logoUrl } : {}),
  };
  return JSON.stringify(payload, null, 2);
}

export function buildAssetMarkdown(asset: IntegrationAsset): string {
  const rules = asset.frameworkRules.map((rule, i) => `${i + 1}. ${rule}`).join('\n');
  const sections = [
    `# ${asset.name}`,
    `_${asset.tagline}_`,
    `**${asset.isOpenSource ? 'Open Source' : 'Closed Source'}**`,
    asset.description,
    `## System Prompt\n\n\`\`\`\n${asset.systemPrompt}\n\`\`\``,
    `## Framework Rules\n\n${rules}`,
    `## MCP Connection\n\n\`\`\`\n${asset.mcpConnectionString}\n\`\`\``,
  ];
  if (asset.installCommand) sections.push(`## Install\n\n\`\`\`bash\n${asset.installCommand}\n\`\`\``);
  return sections.join('\n\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copies the JSON to the clipboard. Returns true on success.
 */
export async function copyAssetJson(asset: IntegrationAsset): Promise<boolean> {
  return copyText(buildAssetJson(asset));
}

export async function copyAssetMarkdown(asset: IntegrationAsset): Promise<boolean> {
  return copyText(buildAssetMarkdown(asset));
}

/**
 * Triggers a browser download of the asset as a .json file.
 */
export function downloadAssetJson(asset: IntegrationAsset): void {
  const json = buildAssetJson(asset);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${asset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
