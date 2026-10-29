import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type AccountView = 'profile' | 'submissions' | 'settings';
interface AccountContextValue { view: AccountView | null; open: (view: AccountView) => void; close: () => void; }
const AccountContext = createContext<AccountContextValue | undefined>(undefined);
export function AccountProvider({ children }: { children: ReactNode }) { const [view, setView] = useState<AccountView | null>(null); const open = useCallback((next: AccountView) => setView(next), []); const close = useCallback(() => setView(null), []); const value = useMemo(() => ({ view, open, close }), [view, open, close]); return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>; }
export function useAccount(): AccountContextValue { const context = useContext(AccountContext); if (!context) throw new Error('useAccount must be used within AccountProvider'); return context; }
