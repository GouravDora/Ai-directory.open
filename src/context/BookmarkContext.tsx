import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface BookmarkContextValue {
  bookmarkIds: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  bookmarkCount: number;
}

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

const STORAGE_KEY = 'ai-directory.bookmarks';

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, []);

  const isBookmarked = useCallback((id: string) => ids.has(id), [ids]);

  const toggleBookmark = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const value = useMemo<BookmarkContextValue>(
    () => ({
      bookmarkIds: [...ids],
      isBookmarked,
      toggleBookmark,
      bookmarkCount: ids.size,
    }),
    [ids, isBookmarked, toggleBookmark],
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarks(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within a BookmarkProvider');
  return ctx;
}
