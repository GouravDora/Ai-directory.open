import { useMemo, useState } from 'react';
import {
  INTEGRATION_ASSETS,
  type AssetCategory,
  type IntegrationAsset,
  type SortOption,
  type SourceFilter,
  getAssetLanguages,
} from '@/data/integrations';
import { incrementUpvote } from '@/lib/submissions';
import { incrementPluginUpvote } from '@/lib/plugins';
import { useBookmarks } from '@/context/BookmarkContext';
import { useAuthorProfile } from '@/context/AuthorProfileContext';
import { FilterBar } from './FilterBar';
import { IntegrationCard } from './IntegrationCard';
import { LocalSearchBar } from './LocalSearchBar';
import { SourceTabs } from './SourceTabs';

interface Props {
  headerQuery: string;
  bookmarksOnly: boolean;
  communityAssets: IntegrationAsset[];
}

export function DirectoryBoard({ headerQuery, bookmarksOnly, communityAssets }: Props) {
  const [category, setCategory] = useState<AssetCategory | 'All'>('All');
  const [localQuery, setLocalQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('popular');
  const [language, setLanguage] = useState('All');
  const [source, setSource] = useState<SourceFilter>('all');
  const { isBookmarked } = useBookmarks();
  const { selectedAuthor, closeAuthor } = useAuthorProfile();

  const allAssets = useMemo(
    () => [...communityAssets, ...INTEGRATION_ASSETS],
    [communityAssets],
  );

  const effectiveQuery = (headerQuery || localQuery).trim().toLowerCase();

  const filtered = useMemo(() => {
    let result = allAssets;

    if (bookmarksOnly) {
      result = result.filter((a) => isBookmarked(a.id));
    }

    if (selectedAuthor) {
      result = result.filter((a) => a.submittedBy === selectedAuthor);
    }

    if (source === 'open') {
      result = result.filter((a) => a.isOpenSource);
    } else if (source === 'closed') {
      result = result.filter((a) => !a.isOpenSource);
    }

    if (category !== 'All') {
      result = result.filter((a) => a.category === category);
    }

    if (language !== 'All') {
      result = result.filter((a) => getAssetLanguages(a).includes(language));
    }

    if (effectiveQuery) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(effectiveQuery) ||
          a.description.toLowerCase().includes(effectiveQuery) ||
          a.tagline.toLowerCase().includes(effectiveQuery) ||
          a.category.toLowerCase().includes(effectiveQuery) ||
          getAssetLanguages(a).some((item) => item.toLowerCase().includes(effectiveQuery)),
      );
    }

    // Sort
    const sorted = [...result];
    if (sort === 'popular') {
      sorted.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sort === 'az') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'recent' — community assets (sub-) first, then by upvotes as fallback
    if (sort === 'recent') {
      sorted.sort((a, b) => {
        const aIsSub = a.id.startsWith('sub-') ? 0 : 1;
        const bIsSub = b.id.startsWith('sub-') ? 0 : 1;
        if (aIsSub !== bIsSub) return aIsSub - bIsSub;
        return b.upvotes - a.upvotes;
      });
    }

    return sorted;
  }, [allAssets, category, effectiveQuery, bookmarksOnly, isBookmarked, selectedAuthor, sort, language, source]);

  const openCount = useMemo(
    () => allAssets.filter((asset) => asset.isOpenSource).length,
    [allAssets],
  );
  const closedCount = allAssets.length - openCount;

  const handleUpvote = (asset: IntegrationAsset) => {
    if (asset.id.startsWith('sub-')) {
      incrementUpvote(asset.id.slice(4));
    } else if (asset.id.startsWith('plugin-')) {
      incrementPluginUpvote(asset.id.slice(7));
    }
  };

  const viewTitle = bookmarksOnly
    ? 'Reading List'
    : selectedAuthor
      ? `Assets by ${selectedAuthor}`
      : source === 'open'
        ? 'Open Source Assets'
        : source === 'closed'
          ? 'Closed Source Assets'
          : 'Integration Board';

  const viewSubtitle = bookmarksOnly
    ? 'Your bookmarked assets, saved in your browser for later reading.'
    : selectedAuthor
      ? 'All assets published by this author.'
      : source === 'open'
        ? 'Browse open-source tools, frameworks, and MCP servers — kept separate from proprietary products.'
        : source === 'closed'
          ? 'Browse proprietary and closed-source products — kept separate from open-source assets.'
          : 'One unified grid for every ecosystem — curated entries plus community submissions. Tap a card to reveal prompts, rules and MCP strings.';

  return (
    <section id="directory" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-obsidian-100">
            {viewTitle}
          </h2>
          <p className="mt-1 text-sm text-obsidian-300">{viewSubtitle}</p>
        </div>
        {selectedAuthor && (
          <button
            type="button"
            onClick={closeAuthor}
            className="btn-primary shrink-0 border border-obsidian-700/70 bg-obsidian-850/60 text-obsidian-200 hover:text-obsidian-100"
          >
            Clear author filter
          </button>
        )}
      </div>

      {/* Local search + filters above the grid */}
      {!selectedAuthor && (
        <div className="mb-4 flex flex-col gap-3">
          <SourceTabs value={source} onChange={setSource} openCount={openCount} closedCount={closedCount} />
          <LocalSearchBar value={localQuery} onChange={setLocalQuery} />
          <FilterBar
            active={category}
            onChange={setCategory}
            resultCount={filtered.length}
            sort={sort}
            onSortChange={setSort}
            language={language}
            onLanguageChange={setLanguage}
            source={source}
            onSourceChange={setSource}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-obsidian-700/60 py-20 text-center">
          {bookmarksOnly ? (
            <>
              <p className="text-sm text-obsidian-200">Your reading list is empty.</p>
              <p className="mt-1 text-xs text-obsidian-300">
                Tap the bookmark icon on any card to save it here.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-obsidian-200">
                {source === 'open'
                  ? 'No open source assets match your search.'
                  : source === 'closed'
                    ? 'No closed source assets match your search.'
                    : 'No assets match your search.'}
              </p>
              <p className="mt-1 text-xs text-obsidian-300">
                Try a different keyword, source tab, or category.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => (
            <IntegrationCard key={asset.id} asset={asset} onUpvote={handleUpvote} />
          ))}
        </div>
      )}
    </section>
  );
}
