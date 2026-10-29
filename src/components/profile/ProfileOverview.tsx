import { useAssetDetail } from '@/context/AssetDetailContext';
import type { ProfileEntry } from '@/lib/profiles';
import { SourceBadge } from '@/components/directory/SourceBadge';

interface Props {
  entries: ProfileEntry[];
}

export function ProfileOverview({ entries }: Props) {
  const { openDetail } = useAssetDetail();

  if (entries.length === 0) {
    return <p className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center text-sm text-obsidian-300">No assets published yet.</p>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {entries.map(({ key, asset }) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => openDetail(asset)}
            className="flex h-full w-full items-start gap-4 rounded-xl border border-obsidian-700/60 bg-obsidian-900/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-green/40 hover:shadow-card"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-obsidian-800 text-neon-green">
              <asset.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-obsidian-100">{asset.name}</span>
                <SourceBadge isOpenSource={asset.isOpenSource} />
              </span>
              <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-obsidian-300">{asset.tagline}</span>
              <span className="mt-2 inline-block rounded-full bg-obsidian-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-obsidian-200">
                {asset.category}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
