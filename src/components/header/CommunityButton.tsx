import { Users } from 'lucide-react';
import { useCommunity } from '@/context/CommunityContext';

export function CommunityButton() {
  const { open } = useCommunity();
  return (
    <button
      type="button"
      onClick={open}
      className="hidden items-center gap-1.5 rounded-lg border border-obsidian-700/70 bg-obsidian-850/60 px-3 py-2 text-xs font-medium text-obsidian-200 transition-colors hover:border-obsidian-500 hover:text-obsidian-100 xl:inline-flex"
    >
      <Users className="h-3.5 w-3.5" />
      Community
    </button>
  );
}
