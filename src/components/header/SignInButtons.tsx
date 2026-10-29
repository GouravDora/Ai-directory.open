import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from './GoogleIcon';
import { GithubIcon } from './GithubIcon';
import { AuthModal } from './AuthModal';

export function SignInButtons() {
  const { login, pendingProvider } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setAuthOpen(true)} className="btn-primary border border-obsidian-700/70 bg-obsidian-850/80 px-3 text-xs text-obsidian-100 hover:border-neon-green/50 hover:bg-obsidian-800 sm:hidden">Sign in</button>
        <button type="button" disabled={!!pendingProvider} onClick={() => { void login('google'); }} className="btn-primary hidden border border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-neon-green/50 hover:bg-obsidian-800 disabled:opacity-60 sm:inline-flex"><GoogleIcon className="h-4 w-4" /><span className="hidden lg:inline">Google</span></button>
        <button type="button" disabled={!!pendingProvider} onClick={() => { void login('github'); }} className="btn-primary hidden border border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-neon-purple/50 hover:bg-obsidian-800 disabled:opacity-60 sm:inline-flex"><GithubIcon className="h-4 w-4" /><span className="hidden lg:inline">GitHub</span></button>
        <button type="button" onClick={() => setAuthOpen(true)} className="hidden rounded-lg px-2 py-2 text-xs font-medium text-obsidian-300 hover:text-obsidian-100 sm:inline">Sign up</button>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
