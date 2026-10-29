import type { ProfileEntry } from '@/lib/profiles';

interface Props {
  entries: ProfileEntry[];
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProfileActivity({ entries }: Props) {
  if (entries.length === 0) {
    return <p className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center text-sm text-obsidian-300">No activity yet.</p>;
  }

  return (
    <ol className="relative space-y-5 border-l border-obsidian-700/70 pl-6">
      {entries.map(({ key, asset, createdAt }) => (
        <li key={key} className="relative">
          <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(57,255,136,0.6)]" />
          <p className="text-sm text-obsidian-200">
            Published <span className="font-semibold text-obsidian-100">{asset.name}</span>
            <span className="text-obsidian-300"> in {asset.category}</span>
          </p>
          <time className="mt-1 block text-xs text-obsidian-300" dateTime={createdAt}>
            {formatDate(createdAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
