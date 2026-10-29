import { useEffect, useState } from 'react';
import { ArrowLeft, UserX, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/lib/router';
import {
  fetchProfileByUsername,
  fetchProfileEntries,
  fetchProfileStats,
  type ProfileEntry,
  type ProfileRow,
  type ProfileStats,
} from '@/lib/profiles';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStatCards } from './ProfileStatCards';
import { ProfileOverview } from './ProfileOverview';
import { ProfileActivity } from './ProfileActivity';
import { ProfileCompanies } from './ProfileCompanies';
import { EditProfileModal } from './EditProfileModal';

type TabKey = 'overview' | 'activity' | 'companies';

interface LoadedProfile {
  profile: ProfileRow;
  stats: ProfileStats;
  entries: ProfileEntry[];
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'missing' }
  | { status: 'ready'; data: LoadedProfile };

export function ProfilePage({ username }: { username: string }) {
  const { user } = useAuth();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [tab, setTab] = useState<TabKey>('overview');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    setTab('overview');

    (async () => {
      try {
        const profile = await fetchProfileByUsername(username);
        if (!active) return;
        if (!profile) {
          setState({ status: 'missing' });
          return;
        }
        const [stats, entries] = await Promise.all([fetchProfileStats(profile.id), fetchProfileEntries(profile.id)]);
        if (active) setState({ status: 'ready', data: { profile, stats, entries } });
      } catch (err) {
        console.warn('[profile] load failed:', err instanceof Error ? err.message : err);
        if (active) setState({ status: 'error' });
      }
    })();

    return () => {
      active = false;
    };
  }, [username]);

  const backButton = (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-obsidian-300 transition-colors hover:text-obsidian-100"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to directory
    </button>
  );

  if (state.status === 'loading') {
    return (
      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
        {backButton}
        <div className="flex items-center gap-3 text-sm text-obsidian-300">
          <Loader2 className="h-4 w-4 animate-spin text-neon-green" />
          Loading profile...
        </div>
      </section>
    );
  }

  if (state.status === 'error' || state.status === 'missing') {
    const missing = state.status === 'missing';
    const Icon = missing ? UserX : AlertTriangle;
    return (
      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
        {backButton}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-obsidian-700/60 bg-obsidian-900/60 px-6 py-14 text-center">
          <Icon className="h-8 w-8 text-obsidian-300" />
          <h1 className="font-display text-lg font-semibold text-obsidian-100">
            {missing ? `No profile found for @${username}` : 'We could not load this profile'}
          </h1>
          <p className="max-w-sm text-sm text-obsidian-300">
            {missing
              ? 'Check the address or go back to the directory to keep exploring.'
              : 'Something went wrong while loading this profile. Please refresh and try again.'}
          </p>
        </div>
      </section>
    );
  }

  const { profile, stats, entries } = state.data;
  const isOwner = user?.id === profile.id;
  const isBusiness = profile.account_type === 'business';
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'activity', label: 'Activity' },
    ...(isBusiness ? [{ key: 'companies' as const, label: 'Companies' }] : []),
  ];

  const updateStats = (change: Partial<ProfileStats>) => {
    setState((prev) =>
      prev.status === 'ready'
        ? { status: 'ready', data: { ...prev.data, stats: { ...prev.data.stats, ...change } } }
        : prev,
    );
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      {backButton}

      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        viewerId={user?.id ?? null}
        followers={stats.followers}
        following={stats.following}
        onEdit={() => setEditing(true)}
        onFollowChange={(delta) => updateStats({ followers: Math.max(0, stats.followers + delta) })}
      />

      <ProfileStatCards stats={stats} entries={entries} />

      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-obsidian-700/60 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'border-neon-green text-obsidian-100'
                  : 'border-transparent text-obsidian-300 hover:text-obsidian-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {tab === 'overview' && <ProfileOverview entries={entries} />}
          {tab === 'activity' && <ProfileActivity entries={entries} />}
          {tab === 'companies' && isBusiness && <ProfileCompanies ownerId={profile.id} isOwner={isOwner} />}
        </div>
      </div>

      {editing && isOwner && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={(updated) => {
            setState((prev) =>
              prev.status === 'ready' ? { status: 'ready', data: { ...prev.data, profile: updated } } : prev,
            );
            setEditing(false);
            if (updated.username !== profile.username) navigate(`/profile/${updated.username}`);
          }}
        />
      )}
    </section>
  );
}
