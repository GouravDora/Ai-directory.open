import type { IntegrationAsset } from './integrations';

export interface AddToolTarget {
  key: string;
  label: string;
  url: string;
}

export const ADD_TO_TOOL_TARGETS: AddToolTarget[] = [
  { key: 'cursor', label: 'Cursor', url: 'https://cursor.com' },
  { key: 'windsurf', label: 'Windsurf', url: 'https://windsurf.com' },
  { key: 'vscode', label: 'VS Code', url: 'https://code.visualstudio.com' },
  { key: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com' },
  { key: 'lovable', label: 'Lovable', url: 'https://lovable.dev' },
  { key: 'elevenlabs', label: 'ElevenLabs', url: 'https://elevenlabs.io' },
];

const OFFICIAL_SITE_BY_ASSET_ID: Record<string, string> = {
  cursor: 'https://cursor.com',
  windsurf: 'https://windsurf.com',
  continue: 'https://continue.dev',
  aider: 'https://aider.chat',
  cline: 'https://cline.bot',
  copilot: 'https://github.com/features/copilot',
  zed: 'https://zed.dev',
  'roo-code': 'https://roocode.com',
  'sourcegraph-cody': 'https://sourcegraph.com/cody',
  'amazon-q': 'https://aws.amazon.com/q/developer/',
  'jetbrains-ai': 'https://www.jetbrains.com/ai/',
  trae: 'https://www.trae.ai',
  lovable: 'https://lovable.dev',
  bolt: 'https://bolt.new',
  v0: 'https://v0.dev',
  replit: 'https://replit.com',
  codesandbox: 'https://codesandbox.io',
  claude: 'https://claude.ai',
  chatgpt: 'https://chatgpt.com',
  gemini: 'https://gemini.google.com',
  perplexity: 'https://www.perplexity.ai',
  deepseek: 'https://www.deepseek.com',
  grok: 'https://x.ai',
  'you-com': 'https://you.com',
  'github-mcp': 'https://github.com/github/github-mcp-server',
  'stripe-mcp': 'https://docs.stripe.com/mcp',
  'sentry-mcp': 'https://sentry.io',
  'neon-mcp': 'https://neon.tech',
  'linear-mcp': 'https://linear.app',
  'notion-mcp': 'https://www.notion.so',
  'supabase-ai': 'https://supabase.com',
  'vercel-ai-sdk': 'https://sdk.vercel.ai',
  'stripe-payments': 'https://stripe.com',
  langchain: 'https://www.langchain.com',
  llamaindex: 'https://www.llamaindex.ai',
  crewai: 'https://www.crewai.com',
  langgraph: 'https://www.langchain.com/langgraph',
  haystack: 'https://haystack.deepset.ai',
  autogen: 'https://microsoft.github.io/autogen/',
  dspy: 'https://dspy.ai',
  midjourney: 'https://www.midjourney.com',
  'stable-diffusion': 'https://stability.ai',
  runway: 'https://runwayml.com',
  elevenlabs: 'https://elevenlabs.io',
  suno: 'https://suno.com',
  'figma-dev': 'https://www.figma.com',
  gamma: 'https://gamma.app',
  'adobe-firefly': 'https://www.adobe.com/products/firefly.html',
};

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getOfficialSiteUrl(asset: IntegrationAsset): string | undefined {
  if (isHttpUrl(asset.websiteUrl)) return asset.websiteUrl;
  const known = OFFICIAL_SITE_BY_ASSET_ID[asset.id];
  return isHttpUrl(known) ? known : undefined;
}
