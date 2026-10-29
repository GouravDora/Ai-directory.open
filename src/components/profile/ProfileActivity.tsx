import type { UpvotedAsset } from '@/lib/upvotes';

interface Props {
  upvoted: UpvotedAsset[];
  isOwner: boolean;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ProfileActivity({ upvoted, isOwner }: Props) {
  if (!isOwner) {
    return (
      <p className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center text-sm text-obsidian-300">
        Activity is private to the account owner.
      </p>
    );
  }

  if (upvoted.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center text-sm text-obsidian-300">
        No upvoted assets yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 border-l border-obsidian-700/70 pl-6">
      {upvoted.map((asset) => (
        <li key={asset.id} className="relative">
          <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(57,255,136,0.6)]" />
          <p className="text-sm text-obsidian-200">
            Upvoted <span className="font-semibold text-obsidian-100">{asset.name}</span>
            <span className="text-obsidian-300"> in {asset.category}</span>
          </p>
          <time className="mt-1 block text-xs text-obsidian-300" dateTime={asset.upvotedAt}>
            {formatDate(asset.upvotedAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
