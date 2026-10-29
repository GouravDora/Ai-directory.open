import { useEffect, useState } from 'react';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { fetchIsFollowing, followProfile, unfollowProfile } from '@/lib/profiles';
import { useToast } from '@/context/ToastContext';

interface Props {
  viewerId: string | null;
  profileId: string;
  displayName: string;
  onChange: (delta: number) => void;
}

export function ProfileFollowButton({ viewerId, profileId, displayName, onChange }: Props) {
  const { notify } = useToast();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!viewerId) return;
    let active = true;
    fetchIsFollowing(viewerId, profileId)
      .then((value) => {
        if (active) setFollowing(value);
      })
      .catch((err: unknown) => {
        console.warn('[profile] follow lookup failed:', err instanceof Error ? err.message : err);
      });
    return () => {
      active = false;
    };
  }, [viewerId, profileId]);

  if (!viewerId) {
    return (
      <button type="button" disabled className="btn-primary cursor-not-allowed opacity-60" title="Sign in to follow builders">
        <UserPlus className="h-4 w-4" />
        Sign in to follow
      </button>
    );
  }

  const handleToggle = async () => {
    if (following === null || busy) return;
    const nextState = !following;
    setBusy(true);
    setFollowing(nextState);
    onChange(nextState ? 1 : -1);
    try {
      if (nextState) await followProfile(viewerId, profileId);
      else await unfollowProfile(viewerId, profileId);
      notify(nextState ? `You are now following ${displayName}` : `Unfollowed ${displayName}`, 'success');
    } catch (err) {
      console.warn('[profile] follow toggle failed:', err instanceof Error ? err.message : err);
      setFollowing(!nextState);
      onChange(nextState ? -1 : 1);
      notify('We could not update this follow. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const label = following ? 'Following' : 'Follow';
  const Icon = following ? UserCheck : UserPlus;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={following === null || busy}
      aria-pressed={Boolean(following)}
      className={`btn-primary min-w-[120px] justify-center border transition-all ${
        following
          ? 'border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-red-400/50 hover:text-red-300'
          : ''
      }`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {following === null ? 'Loading...' : label}
    </button>
  );
}
