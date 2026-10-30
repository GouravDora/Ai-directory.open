<<<<<<< HEAD
=======
import { useState } from 'react';
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05
import { Plus, ArrowRight } from 'lucide-react';
import { useAssetDetail } from '@/context/AssetDetailContext';
import type { StackWithItems } from '@/lib/stacks';

interface Props {
  stacks: StackWithItems[];
  isOwner: boolean;
  viewerId: string | null;
}

export function ProfileStacks({ stacks, isOwner, viewerId }: Props) {
<<<<<<< HEAD
  const { openDetail } = useAssetDetail();
=======
const { openDetail } = useAssetDetail();
const [, setManaging] = useState(false);
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05

  if (stacks.length === 0) {
    if (isOwner && viewerId) {
      return (
        <section className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center">
          <p className="mb-4 text-sm text-obsidian-300">No stacks yet.</p>
          <button
            type="button"
<<<<<<< HEAD
=======
            onClick={() => setManaging(true)}
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05
            className="inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-850/80 px-4 py-2 text-xs font-medium text-obsidian-200 hover:border-neon-green/40 hover:text-neon-green"
          >
            <Plus className="h-4 w-4" /> Create your first stack
          </button>
        </section>
      );
    }
    return (
      <p className="rounded-xl border border-dashed border-obsidian-700/70 px-6 py-12 text-center text-sm text-obsidian-300">
        No stacks yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {stacks.map((stack) => (
        <section
          key={stack.id}
          className="rounded-xl border border-obsidian-700/60 bg-obsidian-900/60 p-5 transition-all duration-200 hover:border-neon-green/40"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-obsidian-100">{stack.name}</h3>
              {stack.description && (
                <p className="mt-1 text-xs text-obsidian-400 line-clamp-2">{stack.description}</p>
              )}
              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-obsidian-500 uppercase tracking-wider">
                {stack.itemCount} asset{stack.itemCount !== 1 ? 's' : ''} <span aria-hidden="true">•</span> {new Date(stack.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
<<<<<<< HEAD
=======
            {isOwner && viewerId && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setManaging(true); }}
                className="rounded-lg border border-obsidian-700/70 bg-obsidian-850/80 px-2.5 py-1.5 text-xs font-medium text-obsidian-300 hover:border-neon-green/40 hover:text-neon-green"
                aria-label="Manage stack"
              >
                Manage
              </button>
            )}
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {stack.items.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => openDetail(asset)}
                className="flex flex-col items-center gap-2 rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 p-3 text-left transition-all duration-200 hover:border-neon-green/40 hover:shadow-card"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-obsidian-800 text-neon-green">
                  <asset.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 truncate text-sm font-semibold text-obsidian-100">{asset.name}</span>
                <span className="min-w-0 truncate text-[10px] text-obsidian-400">{asset.category}</span>
                <ArrowRight className="h-3 w-3 text-obsidian-600" />
              </button>
            ))}
          </div>
        </section>
      ))}
<<<<<<< HEAD
=======
      {isOwner && viewerId && (
        <button
          type="button"
          onClick={() => setManaging(true)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-850/80 px-4 py-2 text-xs font-medium text-obsidian-200 hover:border-neon-green/40 hover:text-neon-green"
        >
          <Plus className="h-4 w-4" /> Create another stack
        </button>
      )}
>>>>>>> 9f91ac43a03608d7b60b83bbf36ef60892758e05
    </div>
  );
}
