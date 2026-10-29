import type { ComponentType, SVGProps } from 'react';
import {
  MousePointerClick,
  Zap,
  Wind,
  Sparkles,
  Bot,
  Hexagon,
  Headphones,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';

/**
 * Inline SVG brand marks for curated integration assets.
 * Each is a simple monochrome path that inherits `currentColor`
 * so it works on any accent background. Falls back to a Lucide
 * icon if no mark exists for a given asset id.
 */

export type LogoRenderer = ComponentType<SVGProps<SVGSVGElement>>;

function CursorMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.5 3.5 19 12 5.5 20.5l3.2-8L5.5 3.5Z" fill="currentColor" />
    </svg>
  );
}

function BoltMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z" fill="currentColor" />
    </svg>
  );
}

function LovableMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10Z" fill="currentColor" />
    </svg>
  );
}

function WindsurfMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4c4 1 8 4 10 9 1 3 1 5 1 7-2-3-4-5-8-6l3-3c-3-2-5-4-6-7Z" fill="currentColor" />
    </svg>
  );
}

function ClaudeMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 3c1.2 0 2.3.3 3.3.9l-2 6.1L9 5.8A6 6 0 0 1 12 3Zm4.5 2.3A6 6 0 0 1 18 12c0 .6-.1 1.2-.2 1.7l-6-2 6.2-1.5a6 6 0 0 0-1.5-3.4ZM6.4 7.3a6 6 0 0 0-1.5 3.4l6.2 1.5-6 2c-.1-.5-.2-1.1-.2-1.7 0-2.3 1.3-4.4 3.5-5.2l-2 3ZM8.8 18.2A6 6 0 0 0 12 19c1.2 0 2.3-.3 3.3-.9l-2-6.1-6.3 1.6a6 6 0 0 0 1.8 4.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function V0Mark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 7h4.5l3 8 3-8H18l-4 11h-2L8 8H3V7Zm15.5 0h2.5v11h-2.5V7Z" fill="currentColor" />
    </svg>
  );
}

function ZendeskMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11 4v7.5L6 4H4v6h2V5l5 7.5V18H6v-2H4v4h9V4h-2Zm9 0h-2v16h2V4Z" fill="currentColor" />
    </svg>
  );
}

function ShopifyMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15.4 5.8c-.4 0-.8.1-1.1.3-.3-.8-.7-1.3-1.2-1.6-.4-.3-.9-.4-1.4-.4h-.2c-1-1-1.9-1.3-2.6-1.3-1.8 0-3.4 1.5-4.3 4-.6 1.8-.8 3.6-.9 4.8-1 .3-1.7 1.3-1.7 1.3l3.8 11.6c.1.4.5.7.9.7h9.3c.5 0 .9-.4.9-.9V6.4c0-.4-.3-.6-.6-.6Zm-3.6.2c-.4.4-.8 1-1 1.7v.2c-.5-.1-.9-.2-.9-.2s-.2-.8.5-1.5c.4-.4.9-.4 1.4-.2ZM9.8 4.8c.3 0 .6.1.9.4-.6.3-1.1.7-1.4 1.3-.3.6-.4 1.2-.3 1.8v.5s-.5 0-1 .2V8.5c0-.7.2-1.6.6-2.5.2-.5.4-.9.6-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// --- New brand marks ---

function GitHubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SlackMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 15a2 2 0 1 1 0-4h2v4H5Zm3 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Zm2-10a2 2 0 1 1 4 0v2H10V5Zm0 3h5a2 2 0 1 1 0 4h-5V8Zm8 1a2 2 0 1 1 0 4h-2v-4h2Zm-3 0a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0v5Zm-1 8h-5a2 2 0 1 1 0-4h5v4Zm0-1a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Z" fill="currentColor" />
    </svg>
  );
}

function OpenAIMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M22 11.5a4.5 4.5 0 0 0-1.2-3.05 4.4 4.4 0 0 0-.4-4.2 4.5 4.5 0 0 0-5.25-2.05A4.5 4.5 0 0 0 7.3 3.2 4.4 4.4 0 0 0 3.05 5.4a4.5 4.5 0 0 0 .55 5.65A4.5 4.5 0 0 0 7.3 20.8a4.4 4.4 0 0 0 4.2 2.05 4.5 4.5 0 0 0 7.7-2.05A4.4 4.4 0 0 0 20.95 16.6 4.5 4.5 0 0 0 22 11.5Zm-9.5 6.25a3.25 3.25 0 0 1-3.15-2.45l1.65-.65a1.7 1.7 0 0 0 1.5 1.05c.7 0 1.25-.35 1.25-.9 0-.5-.45-.75-1.45-1.1l-.55-.2c-1.4-.5-2.2-1.1-2.2-2.4 0-1.35 1.05-2.3 2.65-2.3 1.15 0 1.95.4 2.45 1.35l-1.35.85a1.1 1.1 0 0 0-1.1-.75c-.5 0-.85.3-.85.7 0 .45.3.65 1.1.95l.55.2c1.6.55 2.45 1.2 2.45 2.55 0 1.55-1.25 2.6-3 2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ReplitMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 3h18v18H3V3Zm4 4v3h5V7H7Zm6 0v3h4V7h-4ZM7 11v3h4v-3H7Zm5 0v3h4v-3h-4Zm-5 4v3h6v-3H7Zm7 0v3h3v-3h-3Z" fill="currentColor" />
    </svg>
  );
}

function ContinueMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 4h4v16H6V4Zm8 0h4v16h-4V4Z" fill="currentColor" />
    </svg>
  );
}

function AiderMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3 4 20h3l1.5-4h7l1.5 4h3L12 3Zm0 5 2.5 6h-5L12 8Z" fill="currentColor" />
    </svg>
  );
}

function ClineMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 5h16v3H4V5Zm0 5h16v3H4v-3Zm0 5h16v3H4v-3Z" fill="currentColor" />
    </svg>
  );
}

function CopilotMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2c-1.5 0-3 .5-4 1.5C6 2 3 3 3 6c0 1 .5 2 1 2.5C2 10 1 13 1 16c0 3 2 5 5 5h12c3 0 5-2 5-5 0-3-1-6-3-7.5.5-.5 1-1.5 1-2.5 0-3-3-4-5-2.5C15 2.5 13.5 2 12 2Zm0 4c2 0 4 1 5 3 1 2 1 4 1 6 0 2-2 3-6 3s-6-1-6-3c0-2 0-4 1-6 1-2 3-3 5-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LangChainMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 4a4 4 0 0 0-2.83 6.83l2.12 2.12a1 1 0 0 0 1.42-1.42L7.59 9.41a2 2 0 0 1 2.82-2.82l2.12 2.12a1 1 0 0 0 1.42-1.42L11.83 5.17A4 4 0 0 0 9 4Zm6 6a4 4 0 0 0-2.83 6.83l2.12 2.12a1 1 0 0 0 1.42-1.42l-2.12-2.12a2 2 0 0 1 2.82-2.82l2.12 2.12a1 1 0 0 0 1.42-1.42l-2.12-2.12A4 4 0 0 0 15 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NotionMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4h12l4 4v12H4V4Zm2 2v12h12V9.5L14.5 6H6Zm3 3h6v1.5H9V9Zm0 3h6v1.5H9V12Zm0 3h4v1.5H9V15Z" fill="currentColor" />
    </svg>
  );
}

function LinearMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 12 12 3l9 9-9 9-9-9Zm4 0 5 5 5-5-5-5-5 5Z" fill="currentColor" />
    </svg>
  );
}

function StripeMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 7c-2 0-3.5 1-3.5 2.5 0 1.2.8 1.8 2.2 2.3 1.2.4 1.6.7 1.6 1.1 0 .4-.4.7-1.1.7-.8 0-1.5-.3-2-1l-1.5 1.5c.7 1 2 1.6 3.5 1.6 2.2 0 3.5-1.1 3.5-2.7 0-1.3-.8-1.9-2.3-2.4-1-.4-1.5-.6-1.5-1 0-.3.3-.6 1-.6.7 0 1.2.3 1.6.8l1.4-1.4C16 7.5 15 7 14 7Z" fill="currentColor" />
    </svg>
  );
}

function GoogleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 4c3.6 0 6.7 1.3 9 3.5l-2 2C17.3 7.8 14.8 7 12 7c-2.8 0-5.3 1.8-6.5 4.5l-2.2-2C5.3 5.3 8.4 4 12 4Zm0 13c-2.8 0-5.3-1.8-6.5-4.5l-2.2 2C5.3 18.7 8.4 20 12 20s6.7-1.3 9-3.5l-2-2C17.3 16.2 14.8 17 12 17Z" fill="currentColor" />
    </svg>
  );
}

function PerplexityMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm0 4c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6Zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor" />
    </svg>
  );
}

function SupabaseMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13 22V8l8 9h-5v5h-3Zm-2-6V4L3 13h5v3h3Z" fill="currentColor" />
    </svg>
  );
}

function VercelMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3 22 21H2L12 3Z" fill="currentColor" />
    </svg>
  );
}

function HuggingFaceMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-3 5c2 0 3.5 1 4 2.5H8c.5-1.5 2-2.5 4-2.5Z" fill="currentColor" />
    </svg>
  );
}

function CrewAIMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3 4 7v6c0 4.5 3.5 7.5 8 8 4.5-.5 8-3.5 8-8V7l-8-4Zm0 4 4 2v4c0 2-2 3.5-4 4-2-.5-4-2-4-4V9l4-2Z" fill="currentColor" />
    </svg>
  );
}

function SentryMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2 3 18h4l5-9 5 9h4L12 2Zm0 8 3 6H9l3-6Z" fill="currentColor" />
    </svg>
  );
}

function NeonMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2a10 10 0 0 0-5 18.66V12a5 5 0 0 1 10 0v8.66A10 10 0 0 0 12 2Z" fill="currentColor" />
    </svg>
  );
}

const LOGO_MAP: Record<string, LogoRenderer> = {
  cursor: CursorMark,
  bolt: BoltMark,
  lovable: LovableMark,
  windsurf: WindsurfMark,
  claude: ClaudeMark,
  v0: V0Mark,
  'zendesk-mcp': ZendeskMark,
  'shopify-extensions': ShopifyMark,
  'github-mcp': GitHubMark,
  'slack-mcp': SlackMark,
  'chatgpt': OpenAIMark,
  'replit': ReplitMark,
  'continue': ContinueMark,
  'aider': AiderMark,
  'cline': ClineMark,
  'copilot': CopilotMark,
  'langchain': LangChainMark,
  'notion-mcp': NotionMark,
  'linear-mcp': LinearMark,
  'stripe-mcp': StripeMark,
  'gemini': GoogleMark,
  'perplexity': PerplexityMark,
  'supabase-ai': SupabaseMark,
  'vercel-ai-sdk': VercelMark,
  'huggingchat': HuggingFaceMark,
  'crewai': CrewAIMark,
  'sentry-mcp': SentryMark,
  'neon-mcp': NeonMark,
};

export {
  CursorMark,
  BoltMark,
  LovableMark,
  WindsurfMark,
  ClaudeMark,
  V0Mark,
  ZendeskMark,
  ShopifyMark,
  GitHubMark,
  SlackMark,
  OpenAIMark,
  ReplitMark,
  ContinueMark,
  AiderMark,
  ClineMark,
  CopilotMark,
  LangChainMark,
  NotionMark,
  LinearMark,
  StripeMark,
  GoogleMark,
  PerplexityMark,
  SupabaseMark,
  VercelMark,
  HuggingFaceMark,
  CrewAIMark,
  SentryMark,
  NeonMark,
};

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  cursor: MousePointerClick,
  bolt: Zap,
  lovable: Sparkles,
  windsurf: Wind,
  claude: Bot,
  v0: Hexagon,
  'zendesk-mcp': Headphones,
  'shopify-extensions': ShoppingCart,
};

export function getBrandLogo(id: string): LogoRenderer | undefined {
  return LOGO_MAP[id];
}

export function getFallbackIcon(id: string): LucideIcon {
  return FALLBACK_ICONS[id] ?? Sparkles;
}
