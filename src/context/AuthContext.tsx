import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  username: string | null;
  name: string;
  email: string;
  provider: 'google' | 'github' | 'email';
  avatarInitials: string;
  hue: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticating: boolean;
  pendingProvider: 'google' | 'github' | 'email' | null;
  login: (provider: 'google' | 'github') => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUsername: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authMessage(message: string, mode: 'signin' | 'signup'): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) return 'That email or password is not correct.';
  if (normalized.includes('weak_password') || normalized.includes('known to be weak') || normalized.includes('pwned')) return 'Choose a stronger password that has not been used elsewhere.';
  if (normalized.includes('already registered') || normalized.includes('user already registered')) return 'If this email is already registered, sign in instead.';
  if (normalized.includes('email')) return mode === 'signup' ? 'Enter a valid email address to create your account.' : 'Enter a valid email address and try again.';
  return mode === 'signup' ? 'We could not create your account. Please try again.' : 'We could not sign you in. Please check your details and try again.';
}

function profileFromUser(user: User): UserProfile {
  const name = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || user.email?.split('@')[0] || 'AI Builder';
  const email = user.email ?? '';
  const providerName = (user.app_metadata?.provider as string | undefined) ?? user.identities?.[0]?.provider ?? 'email';
  const provider: UserProfile['provider'] = providerName === 'google' || providerName === 'github' ? providerName : 'email';
  const avatarInitials = name.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'AI';
  return { id: user.id, username: null, name, email, provider, avatarInitials, hue: provider === 'google' ? '#39ff88' : provider === 'github' ? '#b16cff' : '#6ee7f9' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [pendingProvider, setPendingProvider] = useState<AuthContextValue['pendingProvider']>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) { setIsAuthenticating(false); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setUser(data.session?.user ? profileFromUser(data.session.user) : null); setIsAuthenticating(false); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      setUser(session?.user ? profileFromUser(session.user) : null);
      setIsAuthenticating(false);
      setPendingProvider(null);

      const isOAuthCallback = /[?#&](code|access_token|error)=/.test(window.location.href);
      if (event === 'SIGNED_IN' && isOAuthCallback) {
        if (window.location.pathname !== '/') {
          window.location.replace('/');
        } else {
          window.history.replaceState({}, document.title, '/');
        }
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const userId = user?.id;

  const loadUsername = useCallback(async (id: string) => {
    const { data, error } = await supabase.from('profiles').select('username').eq('id', id).maybeSingle();
    if (error) {
      console.warn('[auth] profile lookup failed:', error.message);
      return;
    }
    setUser((prev) => (prev && prev.id === id ? { ...prev, username: data?.username ?? null } : prev));
  }, []);

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;
    void loadUsername(userId);
  }, [userId, loadUsername]);

  const refreshUsername = useCallback(() => (userId ? loadUsername(userId) : Promise.resolve()), [userId, loadUsername]);

  const login = useCallback(async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) return;
    setPendingProvider(provider);
    setIsAuthenticating(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      console.warn('[auth] oauth sign-in failed:', error.message);
      setIsAuthenticating(false);
      setPendingProvider(null);
    }
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) return 'Authentication is not configured.';
    setPendingProvider('email'); setIsAuthenticating(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsAuthenticating(false); setPendingProvider(null);
    return error ? authMessage(error.message, 'signin') : null;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured) return 'Authentication is not configured.';
    setPendingProvider('email'); setIsAuthenticating(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setIsAuthenticating(false); setPendingProvider(null);
    return error ? authMessage(error.message, 'signup') : null;
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticating, pendingProvider, login, signInWithPassword, signUp, logout, refreshUsername }),
    [user, isAuthenticating, pendingProvider, login, signInWithPassword, signUp, logout, refreshUsername],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
