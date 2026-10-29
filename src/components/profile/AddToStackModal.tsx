import { useCallback, useEffect, useState } from 'react';
import { X, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createStack, addStackItem, useStacks } from '@/lib/stacks';

interface Props {
  open: boolean;
  assetId: string;
  assetName: string;
  onClose: () => void;
}

export function AddToStackModal({ open, assetId, assetName, onClose }: Props) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, open]);

  const isLoggedIn = Boolean(user);
  const { stacks, loading } = useStacks(user?.id ?? '', refreshKey);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleAddToStack = async (stackId: string) => {
    if (!isLoggedIn) { onClose(); return; }
    const ok = await addStackItem(stackId, user!.id, assetId);
    if (ok) { notify('Added to stack.'); onClose(); }
    else { notify('Could not add to stack.', 'error'); }
  };

  const handleCreateAndAdd = async () => {
    if (!isLoggedIn || !newName.trim()) return;
    const stack = await createStack(user!.id, { name: newName, description: newDesc });
    if (stack) {
      setCreating(false); setNewName(''); setNewDesc('');
      const ok = await addStackItem(stack.id, user!.id, assetId);
      if (ok) { notify('Added to new stack.'); refresh(); onClose(); }
      else { notify('Stack created but could not add item.', 'error'); onClose(); }
    } else {
      notify('Could not create stack.', 'error');
    }
  };

  if (!open) return null;

  if (!isLoggedIn) {
    return (
      <div
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4 backdrop-blur-sm"
      >
        <div className="w-full max-w-md animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 p-6 shadow-card sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-obsidian-100">Add to Stack</h2>
              <p className="mt-1 text-sm text-obsidian-400">Sign in to save this asset to a collection.</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center text-sm text-obsidian-300">
            You need to be signed in to create stacks and add assets.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4">
        <p className="text-sm text-obsidian-400">Loading stacks…</p>
      </div>
    );
  }

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-obsidian-100">Add to Stack</h2>
            <p className="mt-1 text-sm text-obsidian-400">{assetName}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {stacks.length === 0 ? (
          <p className="text-center text-xs text-obsidian-500 mb-6">No stacks yet. Create one below.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {stacks.map((stack) => (
              <button
                key={stack.id}
                type="button"
                onClick={() => void handleAddToStack(stack.id)}
                className="flex items-center justify-between rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 p-3 text-left hover:border-neon-green/40 hover:bg-obsidian-800/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-obsidian-100">{stack.name}</span>
                  {stack.description && (
                    <span className="block mt-0.5 text-xs text-obsidian-500">{stack.description}</span>
                  )}
                  <span className="mt-1 text-[10px] text-obsidian-500">{stack.itemCount} asset{stack.itemCount !== 1 ? 's' : ''}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-obsidian-600" />
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-obsidian-700/60 pt-5">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-obsidian-500">Or create a new stack</h4>
          <form onSubmit={(e) => { e.preventDefault(); void handleCreateAndAdd(); }} className="space-y-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Stack name (e.g. My Dev Setup)"
              disabled={creating}
              className="rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50 disabled:opacity-50"
            />
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              disabled={creating}
              className="rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 text-xs font-medium text-neon-green disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-green/20"
            >
              <Plus className="h-3.5 w-3.5" /> Create & add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
