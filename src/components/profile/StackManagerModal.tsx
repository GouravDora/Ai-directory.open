import { useCallback, useEffect, useState } from 'react';
import { X, Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAssetDetail } from '@/context/AssetDetailContext';
import { useToast } from '@/context/ToastContext';
import type { StackWithItems } from '@/lib/stacks';
import { createStack, deleteStack, removeStackItem, updateStack, useStacks } from '@/lib/stacks';

function StackRow({
  stack,
  userId,
  isOwner,
  onRefresh,
}: {
  stack: StackWithItems;
  userId: string;
  isOwner: boolean;
  onRefresh: () => void;
}) {
  const { notify } = useToast();
  const { openDetail } = useAssetDetail();
  const [editName, setEditName] = useState(stack.name);
  const [editDesc, setEditDesc] = useState(stack.description);
  const [editing, setEditing] = useState(false);

  const handleUpdate = async () => {
    if (!isOwner) return;
    const ok = await updateStack(stack.id, userId, { name: editName, description: editDesc });
    if (ok) { notify('Stack updated.'); setEditing(false); onRefresh(); }
    else { notify('Could not update stack.', 'error'); }
  };

  const handleDeleteStack = async () => {
    if (!isOwner || !window.confirm('Delete this stack? Its items will be removed.')) return;
    const ok = await deleteStack(stack.id, userId);
    if (ok) { notify('Stack deleted.'); onRefresh(); }
    else { notify('Could not delete stack.', 'error'); }
  };

  const handleRemoveItem = async (assetId: string) => {
    if (!isOwner) return;
    const ok = await removeStackItem(stack.id, userId, assetId);
    if (ok) { notify('Removed from stack.'); onRefresh(); }
    else { notify('Could not remove item.', 'error'); }
  };

  return (
    <section key={stack.id} className="rounded-xl border border-obsidian-700/60 bg-obsidian-850/60 p-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {editing ? (
          <>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-2.5 py-1.5 text-sm font-semibold text-obsidian-100 outline-none focus:border-emerald-500/50 flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-lg border border-neon-green/40 bg-neon-green/10 px-2 py-1.5 text-[10px] font-medium text-neon-green hover:bg-neon-green/20"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setEditName(stack.name); setEditDesc(stack.description); setEditing(false); }}
              className="rounded-lg border border-obsidian-700/70 px-2 py-1.5 text-[10px] text-obsidian-400 hover:text-obsidian-200"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="font-semibold text-obsidian-100 truncate flex-1 min-w-0">{stack.name}</span>
            {stack.description && <span className="text-xs text-obsidian-400 truncate flex-1 min-w-0">{stack.description}</span>}
            {isOwner && (
              <button
                type="button"
                onClick={() => { setEditName(stack.name); setEditDesc(stack.description); setEditing(true); }}
                className="rounded-lg border border-obsidian-700/70 px-2 py-1.5 text-[10px] text-obsidian-400 hover:text-neon-green"
                aria-label="Edit stack"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={handleDeleteStack}
                className="rounded-lg border border-obsidian-700/70 px-2 py-1.5 text-[10px] text-obsidian-400 hover:text-rose-400"
                aria-label="Delete stack"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        )}
      </div>

      <div className="flex items-end gap-3 mb-2">
        <span className="text-[10px] font-medium text-obsidian-500 uppercase tracking-wider mr-2">
          {stack.itemCount} asset{stack.itemCount !== 1 ? 's' : ''}
        </span>
        {stack.items.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={(e) => { e.stopPropagation(); openDetail(asset); }}
            className="flex items-center gap-2 rounded-lg border border-obsidian-700/60 bg-obsidian-950/60 px-2.5 py-1.5 text-xs text-obsidian-200 hover:border-neon-green/40 hover:text-neon-green"
          >
            <asset.icon className="h-3.5 w-3.5 text-neon-green/60" />
            {asset.name}
            {isOwner && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); void handleRemoveItem(asset.assetId ?? ''); }}
                className="ml-2 rounded hover:text-rose-400"
                aria-label="Remove from stack"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

interface Props {
  userId: string;
  onClose: () => void;
}

export function StackManagerModal({ userId, onClose }: Props) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const isOwner = Boolean(user && user.id === userId);
  const { stacks, loading } = useStacks(userId, refreshKey);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleCreate = async () => {
    if (!isOwner || !newName.trim()) return;
    const ok = await createStack(userId, { name: newName, description: newDesc });
    if (ok) {
      setNewName(''); setNewDesc('');
      notify('Stack created.');
      refresh();
    } else {
      notify('Could not create stack.', 'error');
    }
  };

  if (!isOwner) {
    onClose();
    return null;
  }

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-obsidian-100">Manage Stacks</h2>
            <p className="mt-1 text-sm text-obsidian-400">Create, rename, and organize your asset collections.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-obsidian-300 hover:bg-obsidian-700/60 hover:text-obsidian-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading && <p className="text-center text-sm text-obsidian-400">Loading stacks…</p>}

        {!loading && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); void handleCreate(); }} className="space-y-3 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Stack name (e.g. My Dev Setup)"
                  className="rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50"
                />
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 px-3 py-2.5 text-sm text-obsidian-100 outline-none focus:border-emerald-500/50"
                />
              </div>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 text-xs font-medium text-neon-green disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-green/20"
              >
                <Plus className="h-3.5 w-3.5" /> Create stack
              </button>
            </form>

            {stacks.length === 0 ? (
              <p className="text-center text-xs text-obsidian-500">No stacks yet. Create one above.</p>
            ) : (
              <div className="space-y-4">
                {stacks.map((stack) => (
                  <StackRow
                    key={stack.id}
                    stack={stack}
                    userId={userId}
                    isOwner={isOwner}
                    onRefresh={refresh}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
