import { useState } from 'react';
import {
  ArrowBigUp,
  Bookmark,
  BookmarkCheck,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { getAssetLanguages, type IntegrationAsset } from '@/data/integrations';
import { SourceBadge } from './SourceBadge';
import { useToast } from '@/context/ToastContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { useAuthorProfile } from '@/context/AuthorProfileContext';
import { useAssetDetail } from '@/context/AssetDetailContext';

interface Props {
  asset: IntegrationAsset;
  onUpvote?: (asset: IntegrationAsset) => void;
}

export function IntegrationCard({ asset, onUpvote }: Props) {
  const [upvoted, setUpvoted] = useState(false);
  const { notify } = useToast();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { openAuthor } = useAuthorProfile();
  const { openDetail } = useAssetDetail();

  const Icon = asset.icon;
  const Logo = asset.logo;
  const bookmarked = isBookmarked(asset.id);

  const accentText = asset.accent === 'green' ? 'text-emerald-400' : 'text-violet-400';
  const accentSoft =
    asset.accent === 'green'
      ? 'bg-emerald-500/10 border-emerald-500/20'
      : 'bg-violet-500/10 border-violet-500/20';

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvoted((v) => !v);
    notify(upvoted ? 'Upvote removed' : 'Upvoted — thanks for the signal!');
    if (!upvoted) onUpvote?.(asset);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(asset.id);
    notify(bookmarked ? 'Removed from reading list' : 'Saved to reading list!');
  };

  return (
    <div
      onClick={() => openDetail(asset)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openDetail(asset);
      }}
      className="card-surface group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:border-obsidian-500/70 hover:shadow-card"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border bg-obsidian-800 ${accentSoft}`}
          >
            {Logo ? (
              <Logo className={`h-7 w-7 ${accentText}`} />
            ) : (
              <Icon className={`h-6 w-6 ${accentText}`} strokeWidth={1.75} />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-obsidian-100">{asset.name}</h3>
              <SourceBadge isOpenSource={asset.isOpenSource} />
              <span className="rounded-full border border-obsidian-700/60 bg-obsidian-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-obsidian-300">
                {asset.category}
              </span>
            </div>
            <p className={`text-xs font-medium ${accentText}`}>{asset.tagline}</p>
            {asset.submittedBy && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openAuthor(asset.submittedBy!);
                }}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-obsidian-300 transition-colors hover:text-obsidian-100"
              >
                <User className="h-3 w-3" />
                by {asset.submittedBy}
              </button>
            )}
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-obsidian-400 transition-all duration-200 group-hover:text-obsidian-200" />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-obsidian-200">{asset.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{getAssetLanguages(asset).slice(0, 4).map((language) => <span key={language} className="rounded-md border border-obsidian-700/60 bg-obsidian-950/40 px-2 py-0.5 text-[10px] text-obsidian-300">{language}</span>)}</div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleUpvote}
            aria-pressed={upvoted}
            className={`group/up inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
              upvoted
                ? asset.accent === 'green'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-400'
                : 'border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
            }`}
          >
            {upvoted ? (
              <ArrowBigUp className="h-4 w-4" fill="currentColor" />
            ) : (
              <ArrowBigUp className="h-4 w-4 transition-transform group-hover/up:-translate-y-0.5" />
            )}
            <span className="font-mono tabular-nums">
              {asset.upvotes + (upvoted ? 1 : 0)}
            </span>
          </button>

          <button
            type="button"
            onClick={handleBookmark}
            aria-pressed={bookmarked}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
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
          </button>

          <span className="ml-auto text-[11px] text-obsidian-400 transition-colors group-hover:text-obsidian-300">
            Click to view details
          </span>
        </div>
      </div>
    </div>
  );
}
