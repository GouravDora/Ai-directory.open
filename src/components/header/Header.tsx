import { BrandMark } from './BrandMark';
import { SearchBar } from './SearchBar';
import { AuthControls } from './AuthControls';
import { SubmitButton } from './SubmitButton';
import { ImportButton } from './ImportButton';
import { BookmarksButton } from './BookmarksButton';
import { PluginButton } from './PluginButton';
import { CommunityButton } from './CommunityButton';

interface Props {
  onQuery: (q: string) => void;
  onToggleBookmarks: () => void;
  bookmarksActive: boolean;
}

export function Header({ onQuery, onToggleBookmarks, bookmarksActive }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-panel border-b border-obsidian-700/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          <BrandMark />
          <div className="hidden min-w-[260px] max-w-[440px] flex-1 px-2 lg:block lg:px-4">
            <SearchBar onQuery={onQuery} />
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            <CommunityButton />
            <span className="hidden sm:block"><PluginButton /></span>
            <SubmitButton />
            <span className="hidden sm:block"><ImportButton /></span>
            <BookmarksButton onClick={onToggleBookmarks} active={bookmarksActive} />
            <AuthControls />
          </div>
        </div>
        <div className="px-4 pb-3 lg:hidden">
          <SearchBar onQuery={onQuery} />
        </div>
      </div>
    </header>
  );
}
