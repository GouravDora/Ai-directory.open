import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface SubmissionModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SubmissionModalContext = createContext<SubmissionModalContextValue | undefined>(undefined);

export function SubmissionModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<SubmissionModalContextValue>(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <SubmissionModalContext.Provider value={value}>{children}</SubmissionModalContext.Provider>
  );
}

export function useSubmissionModal(): SubmissionModalContextValue {
  const ctx = useContext(SubmissionModalContext);
  if (!ctx) throw new Error('useSubmissionModal must be used within a SubmissionModalProvider');
  return ctx;
}
