import { useEffect, useState } from 'react';
import {
  X,
  Terminal,
  FileCode,
  Cable,
  Check,
  Copy,
  Download,
  Braces,
  ArrowBigUp,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  FileText,
  Plus,
} from 'lucide-react';
import { getOfficialSiteUrl } from '@/data/officialSites';
import { useAssetDetail } from '@/context/AssetDetailContext';
import { useToast } from '@/context/ToastContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { copyAssetJson, copyAssetMarkdown, downloadAssetJson } from '@/lib/exportAsset';
import { AddToToolMenu } from './AddToToolMenu';
import { SourceBadge } from './SourceBadge';
import { AssetLogo } from './AssetLogo';
import { AuthorLink } from './AuthorLink';
import { AddToStackModal } from '@/components/profile/AddToStackModal';
import { secureUpvoteAsset } from '@/lib/upvotes';

type TabKey = 'system' | 'rules' | 'mcp';

const TABS: { key: TabKey; label: string; icon: typeof Terminal }[] = [
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
      /* clipboard may be unavailable */
    }
    setCopied(true);
    notify('Copied to clipboard!');
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
        copied
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-obsidian-700/70 bg-obsidian-800/80 text-obsidian-100 hover:border-emerald-500/30 hover:text-emerald-400'
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-obsidian-700/60 bg-obsidian-950/80 p-4 font-mono text-xs leading-relaxed text-obsidian-100">
      <code className="whitespace-pre-wrap">{code}</code>
    </pre>
  );
}

export function AssetDetailModal() {
  const { selectedAsset, closeDetail } = useAssetDetail();
  const { notify } = useToast();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [tab, setTab] = useState<TabKey>('system');
  const [upvoted, setUpvoted] = useState(false);
  const [addToStackOpen, setAddToStackOpen] = useState(false);

  useEffect(() => {
    if (!selectedAsset) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedAsset, closeDetail]);

  useEffect(() => {
    setTab('system');
    setUpvoted(false);
  }, [selectedAsset]);

  if (!selectedAsset) return null;

  const asset = selectedAsset;
  const bookmarked = isBookmarked(asset.id);
  const accentText = asset.accent === 'green' ? 'text-emerald-400' : 'text-violet-400';

  const handleUpvote = async () => {
    if (!asset.assetId) {
      notify('Sign in to upvote.');
      return;
    }
    setUpvoted((v) => !v);
    const result = await secureUpvoteAsset(asset.assetId);
    if (result === null) {
      setUpvoted((v) => !v);
      notify('You must be signed in to upvote.');
      return;
    }
    notify(result === 'upvoted' ? 'Upvoted — thanks for the signal!' : 'Upvote removed.');
  };

  const handleBookmark = () => {
    toggleBookmark(asset.id);
    notify(bookmarked ? 'Removed from reading list' : 'Saved to reading list!');
  };

  const handleCopyJson = async () => {
    const ok = await copyAssetJson(asset);
    if (ok) {
      notify('Asset JSON copied to clipboard!');
    } else {
      notify('Could not access clipboard.', 'error');
    }
  };

  const handleCopyMarkdown = async () => {
    const ok = await copyAssetMarkdown(asset);
    notify(ok ? 'Asset Markdown copied to clipboard!' : 'Could not access clipboard.', ok ? 'success' : 'error');
  };

  const handleDownload = () => {
    downloadAssetJson(asset);
    notify('Asset downloaded as JSON!');
  };

  const copyText =
    tab === 'system'
      ? asset.systemPrompt
      : tab === 'rules'
        ? asset.frameworkRules.join('\n')
        : asset.mcpConnectionString;
  const safeLink = (value?: string) => {
    if (!value) return undefined;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
    } catch {
      return undefined;
    }
  };
  const repositoryUrl = safeLink(asset.repositoryUrl);
  const websiteUrl = getOfficialSiteUrl(asset);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeDetail();
      }}
      className="fixed inset-0 z-[75] flex items-start justify-center overflow-y-auto bg-obsidian-950/85 px-4 py-8 backdrop-blur-sm sm:py-12"
    >
      <div className="relative w-full max-w-4xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 shadow-card backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-obsidian-700/60 px-6 py-5">
          <div className="flex items-start gap-4">
            <AssetLogo asset={asset} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-obsidian-100">
                  {asset.name}
                </h2>
                <SourceBadge isOpenSource={asset.isOpenSource} size="md" />
                <span className="rounded-full border border-obsidian-700/60 bg-obsidian-800 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-obsidian-300">
                  {asset.category}
                </span>
              </div>
              <p className={`mt-0.5 text-sm font-medium ${accentText}`}>{asset.tagline}</p>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-obsidian-200 underline-offset-4 transition-colors hover:text-neon-green hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit Official Website / Docs
                </a>
              )}
              {asset.submittedBy && (
                <AuthorLink name={asset.submittedBy} className="mt-1.5" onNavigate={closeDetail} />
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={closeDetail}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-obsidian-300 transition-colors hover:bg-obsidian-700/60 hover:text-obsidian-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description + stats bar */}
        <div className="border-b border-obsidian-700/60 px-6 py-4">
          <p className="text-sm leading-relaxed text-obsidian-200">{asset.description}</p>
          {(asset.installCommand || repositoryUrl) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {asset.installCommand && (
                <div className="flex min-w-0 items-center gap-2 rounded-lg border border-obsidian-700/60 bg-obsidian-950/70 px-3 py-2 font-mono text-[11px] text-emerald-300">
                  <span className="text-obsidian-400">$</span>
                  <code className="truncate">{asset.installCommand}</code>
                </div>
              )}
              {repositoryUrl && <a href={repositoryUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-obsidian-700/60 px-3 py-2 text-xs text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100">Repository</a>}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleUpvote}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  upvoted
                    ? asset.accent === 'green'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-violet-500/30 bg-violet-500/10 text-violet-400'
                    : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
                }`}
              >
                <ArrowBigUp className="h-4 w-4" fill={upvoted ? 'currentColor' : 'none'} />
                <span className="font-mono tabular-nums">
                  {asset.upvotes + (upvoted ? 1 : 0)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddToStackOpen(true);
                }}
                className={asset.assetId
                  ? 'inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/60 px-3 py-1.5 text-xs font-medium bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100 transition-all active:scale-95'
                  : 'inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/60 px-3 py-1.5 text-xs font-medium bg-obsidian-800/50 text-obsidian-400 cursor-not-allowed transition-all active:scale-95'}
                disabled={!asset.assetId}
              >
                <Plus className="h-4 w-4" />
                {asset.assetId ? 'Add to Stack' : 'Sign in'}
              </button>

            <button
              type="button"
              onClick={handleBookmark}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                bookmarked
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
              }`}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4" fill="currentColor" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {bookmarked ? 'Saved' : 'Save'}
            </button>

            <AddToToolMenu text={copyText} />

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <CopyButton text={copyText} />
              <div className="relative">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-800/80 px-2.5 py-1.5 text-xs font-medium text-obsidian-100 transition-all hover:border-violet-500/30 hover:text-violet-400 active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  .json
                </button>
              </div>
              <button
                type="button"
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-800/80 px-2.5 py-1.5 text-xs font-medium text-obsidian-100 transition-all hover:border-violet-500/30 hover:text-violet-400 active:scale-95"
              >
                <Braces className="h-3.5 w-3.5" />
                Copy as JSON
              </button>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-800/80 px-2.5 py-1.5 text-xs font-medium text-obsidian-100 transition-all hover:border-violet-500/30 hover:text-violet-400 active:scale-95"
              >
                <FileText className="h-3.5 w-3.5" />
                Copy as Markdown
              </button>
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-obsidian-800 text-obsidian-100 shadow-card'
                      : 'text-obsidian-300 hover:bg-obsidian-800/60 hover:text-obsidian-100'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {tab === 'system' && <CodeBlock code={asset.systemPrompt} />}

            {tab === 'rules' && (
              <ul className="space-y-2">
                {asset.frameworkRules.map((rule, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 px-4 py-3 font-mono text-xs leading-relaxed text-obsidian-100"
                  >
                    <span className="shrink-0 font-bold text-emerald-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'mcp' && (
              <div className="space-y-3">
                <CodeBlock code={asset.mcpConnectionString} />
                <div className="flex items-center gap-2 text-[11px] text-obsidian-300">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>
                    Add this string to your MCP client config to connect this tool.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {asset.assetId && addToStackOpen && (
        <AddToStackModal
          open={addToStackOpen}
          assetId={asset.assetId}
          assetName={asset.name}
          onClose={() => setAddToStackOpen(false)}
        />
      )}
    </div>
  );
}
