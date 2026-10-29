import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ImportModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ImportModalContext = createContext<ImportModalContextValue | undefined>(undefined);

export function ImportModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ImportModalContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return <ImportModalContext.Provider value={value}>{children}</ImportModalContext.Provider>;
}

export function useImportModal(): ImportModalContextValue {
  const ctx = useContext(ImportModalContext);
  if (!ctx) throw new Error('useImportModal must be used within an ImportModalProvider');
  return ctx;
}
