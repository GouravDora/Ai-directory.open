import { useRef, useState } from 'react';
import { Terminal, FileCode, Cable, Check, Copy, Download, Braces } from 'lucide-react';
import { type IntegrationAsset } from '@/data/integrations';
import { useToast } from '@/context/ToastContext';
import { buildAssetJson, copyAssetJson, downloadAssetJson } from '@/lib/exportAsset';

type TabKey = 'system' | 'rules' | 'mcp';

interface TabDef {
  key: TabKey;
  label: string;
  icon: typeof Terminal;
}

const TABS: TabDef[] = [
  { key: 'system', label: 'System Prompt', icon: Terminal },
  { key: 'rules', label: 'Framework Rules', icon: FileCode },
  { key: 'mcp', label: 'MCP Connection', icon: Cable },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { notify } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be unavailable in sandboxed contexts */
    }
    setCopied(true);
    notify('Copied to Clipboard!');
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95 ${
        copied
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-obsidian-700/70 bg-obsidian-800/80 text-obsidian-100 hover:border-emerald-500/30 hover:text-emerald-400'
      }`}
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy Code'}
    </button>
  );
}

function ExportButton({ asset }: { asset: IntegrationAsset }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { notify } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  const handleCopyJson = async () => {
    setOpen(false);
    const ok = await copyAssetJson(asset);
    if (ok) {
      setCopied(true);
      notify('Asset JSON copied to Clipboard!');
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      notify('Could not access clipboard.', 'error');
    }
  };

  const handleDownload = () => {
    setOpen(false);
    downloadAssetJson(asset);
    notify('Asset downloaded as JSON!');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95 ${
          copied
            ? 'border-neon-purple/50 bg-neon-purple/10 text-neon-purple'
            : 'border-obsidian-700/70 bg-obsidian-800/80 text-obsidian-100 hover:border-neon-purple/40 hover:text-neon-purple'
        }`}
        aria-label="Export as JSON"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Export'}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-48 origin-top-right animate-slide-down overflow-hidden rounded-lg border border-obsidian-700/70 bg-obsidian-850/95 shadow-card backdrop-blur-xl">
            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-obsidian-100 transition-colors hover:bg-obsidian-700/60"
            >
              <Download className="h-3.5 w-3.5 text-neon-purple" />
              Download .json
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex w-full items-center gap-2.5 border-t border-obsidian-700/60 px-3 py-2 text-left text-xs text-obsidian-100 transition-colors hover:bg-obsidian-700/60"
            >
              <Braces className="h-3.5 w-3.5 text-neon-purple" />
              Copy JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-obsidian-700/60 bg-obsidian-950/80 p-3 font-mono text-xs leading-relaxed text-obsidian-100">
      <code className="whitespace-pre">{code}</code>
    </pre>
  );
}

export function CodeTabs({ asset }: { asset: IntegrationAsset }) {
  const [tab, setTab] = useState<TabKey>('system');

  const content: Record<TabKey, React.ReactNode> = {
    system: <CodeBlock code={asset.systemPrompt} />,
    rules: (
      <ul className="space-y-1.5">
        {asset.frameworkRules.map((rule, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 px-3 py-2 font-mono text-xs leading-relaxed text-obsidian-100"
          >
            <span className="text-emerald-400">{String(i + 1).padStart(2, '0')}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    ),
    mcp: <CodeBlock code={asset.mcpConnectionString} />,
  };

  return (
    <div>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-obsidian-800 text-obsidian-100 shadow-card'
                  : 'text-obsidian-300 hover:bg-obsidian-800/60 hover:text-obsidian-100'
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <CopyButton
            text={
              tab === 'system'
                ? asset.systemPrompt
                : tab === 'rules'
                  ? asset.frameworkRules.join('\n')
                  : asset.mcpConnectionString
            }
          />
          <ExportButton asset={asset} />
        </div>
        {content[tab]}
      </div>
    </div>
  );
}
