import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/context/BookmarkContext';

interface Props {
  onClick: () => void;
  active: boolean;
}

export function BookmarksButton({ onClick, active }: Props) {
  const { bookmarkCount } = useBookmarks();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-primary border px-2.5 transition-all ${
        active
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
          : 'border-obsidian-700/70 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
      }`}
      title="Reading list"
    >
      <Bookmark className="h-4 w-4" />
      {bookmarkCount > 0 && (
        <span className="font-mono tabular-nums text-xs">{bookmarkCount}</span>
      )}
    </button>
  );
}
