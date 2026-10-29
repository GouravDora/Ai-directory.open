import { useState, type FormEvent } from 'react';
import { Briefcase, User, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  USERNAME_PATTERN,
  updateOwnProfile,
  type AccountType,
  type ProfileRow,
} from '@/lib/profiles';

interface Props {
  profile: ProfileRow;
  onClose: () => void;
  onSaved: (profile: ProfileRow) => void;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-500 focus:border-neon-green/60 focus:outline-none';

const ACCOUNT_OPTIONS: { value: AccountType; label: string; hint: string; icon: typeof User }[] = [
  { value: 'personal', label: 'Personal', hint: 'For individual builders.', icon: User },
  { value: 'business', label: 'Business', hint: 'Also manage companies on your profile.', icon: Briefcase },
];

export function EditProfileModal({ profile, onClose, onSaved }: Props) {
  const { user, refreshUsername } = useAuth();
  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [accountType, setAccountType] = useState<AccountType>(profile.account_type);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !user) return;
    const nextUsername = username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(nextUsername)) {
      setError('Username must be 3-30 characters: lowercase letters, numbers, - or _.');
      return;
    }
    const update = {
      username: nextUsername,
      display_name: displayName.trim().slice(0, 60),
      bio: bio.trim().slice(0, 280),
      account_type: accountType,
    };
    setSaving(true);
    setError(null);
    const message = await updateOwnProfile(user.id, update);
    setSaving(false);
    if (message) {
      setError(message);
      return;
    }
    await refreshUsername();
    onSaved({ ...profile, ...update });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-obsidian-700/70 bg-obsidian-900 p-6 shadow-card"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="edit-profile-title" className="font-display text-lg font-semibold text-obsidian-100">Edit profile</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-obsidian-300 hover:bg-obsidian-800 hover:text-obsidian-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5 text-xs font-medium text-obsidian-200">
            Display name
            <input className={FIELD_CLASS} value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} />
          </label>
          <label className="block space-y-1.5 text-xs font-medium text-obsidian-200">
            Username
            <input className={`${FIELD_CLASS} font-mono`} value={username} onChange={(e) => setUsername(e.target.value)} maxLength={30} required />
          </label>
          <label className="block space-y-1.5 text-xs font-medium text-obsidian-200">
            Bio
            <textarea className={`${FIELD_CLASS} min-h-[88px] resize-y`} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} />
            <span className="block text-right text-[11px] text-obsidian-400">{bio.length}/280</span>
          </label>

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-obsidian-200">Account type</legend>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_OPTIONS.map((option) => {
                const selected = accountType === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors ${
                      selected ? 'border-neon-green/60 bg-neon-green/5' : 'border-obsidian-700/70 hover:border-obsidian-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="account-type"
                      value={option.value}
                      checked={selected}
                      onChange={() => setAccountType(option.value)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-2 text-sm font-medium text-obsidian-100">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </span>
                    <span className="text-[11px] leading-snug text-obsidian-300">{option.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && <p role="alert" className="text-xs text-red-300">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-obsidian-300 transition-colors hover:text-obsidian-100">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
