import { Lock, Unlock } from 'lucide-react';

interface Props {
  isOpenSource: boolean;
  size?: 'sm' | 'md';
}

export function SourceBadge({ isOpenSource, size = 'sm' }: Props) {
  const compact = size === 'sm';
  if (isOpenSource) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-neon-green/70 bg-neon-green/15 font-bold uppercase tracking-wide text-neon-green shadow-[0_0_14px_rgba(57,255,136,0.55)] ${
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <Unlock className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.4} />
        Open Source
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-obsidian-500 bg-obsidian-800 font-bold uppercase tracking-wide text-obsidian-300 ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <Lock className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.4} />
      Closed Source
    </span>
  );
}
