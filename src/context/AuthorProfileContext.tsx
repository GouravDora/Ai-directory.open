import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthorProfileContextValue {
  selectedAuthor: string | null;
  openAuthor: (name: string) => void;
  closeAuthor: () => void;
}

const AuthorProfileContext = createContext<AuthorProfileContextValue | undefined>(undefined);

export function AuthorProfileProvider({ children }: { children: ReactNode }) {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const openAuthor = useCallback((name: string) => setSelectedAuthor(name), []);
  const closeAuthor = useCallback(() => setSelectedAuthor(null), []);

  const value = useMemo<AuthorProfileContextValue>(
    () => ({ selectedAuthor, openAuthor, closeAuthor }),
    [selectedAuthor, openAuthor, closeAuthor],
  );

  return <AuthorProfileContext.Provider value={value}>{children}</AuthorProfileContext.Provider>;
}

export function useAuthorProfile(): AuthorProfileContextValue {
  const ctx = useContext(AuthorProfileContext);
  if (!ctx) throw new Error('useAuthorProfile must be used within an AuthorProfileProvider');
  return ctx;
}
