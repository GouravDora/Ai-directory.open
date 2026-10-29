import { useAuth } from '@/context/AuthContext';
import { SignInButtons } from './SignInButtons';
import { UserProfileMenu } from './UserProfileMenu';
import { Loader2 } from 'lucide-react';

export function AuthControls() {
  const { user, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return (
      <div className="flex items-center gap-2 text-sm text-obsidian-300">
        <Loader2 className="h-4 w-4 animate-spin text-neon-green" />
        <span className="hidden sm:inline">Authenticating…</span>
      </div>
    );
  }

  return user ? <UserProfileMenu user={user} /> : <SignInButtons />;
}
