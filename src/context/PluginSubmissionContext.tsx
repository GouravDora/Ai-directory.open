import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface PluginSubmissionContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const PluginSubmissionContext = createContext<PluginSubmissionContextValue | undefined>(undefined);

export function PluginSubmissionProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <PluginSubmissionContext.Provider value={value}>{children}</PluginSubmissionContext.Provider>;
}

export function usePluginSubmission(): PluginSubmissionContextValue {
  const context = useContext(PluginSubmissionContext);
  if (!context) throw new Error('usePluginSubmission must be used within PluginSubmissionProvider');
  return context;
}
