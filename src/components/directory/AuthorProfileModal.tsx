import { useEffect, useMemo } from 'react';
import { X, User, FileCode2 } from 'lucide-react';
import { useAuthorProfile } from '@/context/AuthorProfileContext';
import { INTEGRATION_ASSETS, type IntegrationAsset } from '@/data/integrations';
import { IntegrationCard } from '@/components/directory/IntegrationCard';

interface Props {
  assets: IntegrationAsset[];
}

export function AuthorProfileModal({ assets }: Props) {
  const { selectedAuthor, closeAuthor } = useAuthorProfile();

  useEffect(() => {
    if (!selectedAuthor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthor();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedAuthor, closeAuthor]);

  const authorAssets = useMemo(() => {
    if (!selectedAuthor) return [];
    const all = [...assets, ...INTEGRATION_ASSETS];
    const seen = new Set<string>();
    return all.filter((a) => {
      if (a.submittedBy !== selectedAuthor) return false;
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  }, [selectedAuthor, assets]);

  if (!selectedAuthor) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuthor();
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-obsidian-950/80 px-4 py-8 backdrop-blur-sm sm:py-12"
    >
      <div className="relative w-full max-w-5xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 shadow-card backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian-700/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-obsidian-600 bg-obsidian-800 text-obsidian-100">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-obsidian-100">
                {selectedAuthor}
              </h2>
              <p className="text-xs text-obsidian-300">
                {authorAssets.length} {authorAssets.length === 1 ? 'asset' : 'assets'} published
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthor}
            className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 transition-colors hover:bg-obsidian-700/60 hover:text-obsidian-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {authorAssets.length === 0 ? (
            <div className="grid place-items-center py-16 text-center">
              <FileCode2 className="h-8 w-8 text-obsidian-400" />
              <p className="mt-3 text-sm text-obsidian-200">No published assets yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {authorAssets.map((asset) => (
                <IntegrationCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
