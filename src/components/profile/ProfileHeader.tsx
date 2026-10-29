import { Briefcase, Pencil, User } from 'lucide-react';
import type { ProfileRow } from '@/lib/profiles';
import { ProfileFollowButton } from './ProfileFollowButton';

const AVATAR_HUES = ['#39ff88', '#6ee7f9', '#fbbf24'];

function avatarHue(seed: string): string {
  const sum = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_HUES[sum % AVATAR_HUES.length];
}

function initialsFor(profile: ProfileRow): string {
  const source = profile.display_name.trim() || profile.username;
  return source.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'AI';
}

interface Props {
  profile: ProfileRow;
  isOwner: boolean;
  viewerId: string | null;
  followers: number;
  following: number;
  onEdit: () => void;
  onFollowChange: (delta: number) => void;
}

export function ProfileHeader({ profile, isOwner, viewerId, followers, following, onEdit, onFollowChange }: Props) {
  const hue = avatarHue(profile.username);
  const isBusiness = profile.account_type === 'business';
  const displayName = profile.display_name.trim() || profile.username;

  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-obsidian-700/60 bg-obsidian-900/70 p-6 sm:flex-row sm:items-start sm:p-8">
      <span
        className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-obsidian-950"
        style={{ backgroundColor: hue, boxShadow: `0 0 24px -6px ${hue}` }}
        aria-hidden="true"
      >
        {initialsFor(profile)}
      </span>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-semibold text-obsidian-100">{displayName}</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
              isBusiness
                ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                : 'border-obsidian-700/70 bg-obsidian-800 text-obsidian-200'
            }`}
          >
            {isBusiness ? <Briefcase className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isBusiness ? 'Business' : 'Personal'}
          </span>
        </div>

        <p className="font-mono text-sm text-obsidian-300">@{profile.username}</p>

        <p className="text-sm leading-relaxed text-obsidian-200">
          {profile.bio.trim() || 'This builder has not added a bio yet.'}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-sm text-obsidian-300">
          <span>
            <strong className="font-semibold tabular-nums text-obsidian-100">{followers}</strong> followers
          </span>
          <span>
            <strong className="font-semibold tabular-nums text-obsidian-100">{following}</strong> following
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {isOwner ? (
          <button
            type="button"
            onClick={onEdit}
            className="btn-primary border border-obsidian-700/70 bg-obsidian-850/80 text-obsidian-100 hover:border-obsidian-500 hover:bg-obsidian-800"
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </button>
        ) : (
          <ProfileFollowButton
            viewerId={viewerId}
            profileId={profile.id}
            displayName={displayName}
            onChange={onFollowChange}
          />
        )}
      </div>
    </header>
  );
}
