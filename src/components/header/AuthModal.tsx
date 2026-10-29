import { useEffect, useState, type FormEvent } from 'react';
import { Github, Loader2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { GoogleIcon } from './GoogleIcon';

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInWithPassword, signUp, login, pendingProvider } = useAuth();
  const { notify } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'signup' && password.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    const message = mode === 'signin' ? await signInWithPassword(email, password) : await signUp(name, email, password);
    if (message) { setError(message); return; }
    notify(mode === 'signin' ? 'Welcome back.' : 'Account created. Welcome to the community.');
    onClose();
  };

  const oauth = async (provider: 'google' | 'github') => {
    setError('');
    await login(provider);
  };

  return <div className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="w-full max-w-md animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 p-6 shadow-card"><div className="flex items-start justify-between"><div><h2 className="font-display text-xl font-semibold text-obsidian-100">{mode === 'signin' ? 'Welcome back' : 'Join the community'}</h2><p className="mt-1 text-sm text-obsidian-300">Save submissions, join companies, and build your public profile.</p></div><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close"><X className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-2"><button type="button" disabled={!!pendingProvider} onClick={() => oauth('google')} className="btn-primary border border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-emerald-500/40"><GoogleIcon className="h-4 w-4" />Google</button><button type="button" disabled={!!pendingProvider} onClick={() => oauth('github')} className="btn-primary border border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-violet-500/40"><Github className="h-4 w-4" />GitHub</button></div><div className="my-5 flex items-center gap-3 text-[11px] text-obsidian-400"><span className="h-px flex-1 bg-obsidian-700" />or use email<span className="h-px flex-1 bg-obsidian-700" /></div><form onSubmit={submit} className="space-y-3">{mode === 'signup' && <input required className="w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />}<input required type="email" className="w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /><input required minLength={8} type="password" className="w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" />{error && <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}<button type="submit" disabled={!!pendingProvider} className="btn-primary w-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 disabled:opacity-60">{pendingProvider === 'email' && <Loader2 className="h-4 w-4 animate-spin" />}{mode === 'signin' ? 'Sign in' : 'Create account'}</button></form><button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }} className="mt-4 w-full text-xs text-obsidian-300 hover:text-emerald-400">{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></div></div>;
}
