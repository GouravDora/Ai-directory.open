import { Layers, Lock, Unlock } from 'lucide-react';
import type { SourceFilter } from '@/data/integrations';

interface Props {
  value: SourceFilter;
  onChange: (value: SourceFilter) => void;
  openCount: number;
  closedCount: number;
}

const TABS: {
  value: SourceFilter;
  label: string;
  icon: typeof Unlock;
  activeClass: string;
  iconClass: string;
}[] = [
  {
    value: 'all',
    label: 'All',
    icon: Layers,
    activeClass: 'border-obsidian-400 bg-obsidian-800 text-obsidian-100',
    iconClass: 'text-obsidian-200',
  },
  {
    value: 'open',
    label: 'Open Source',
    icon: Unlock,
    activeClass: 'border-neon-green/50 bg-neon-green/10 text-neon-green shadow-[0_0_16px_rgba(57,255,136,0.2)]',
    iconClass: 'text-neon-green',
  },
  {
    value: 'closed',
    label: 'Closed Source',
    icon: Lock,
    activeClass: 'border-obsidian-500 bg-obsidian-800 text-obsidian-200',
    iconClass: 'text-obsidian-400',
  },
];

export function SourceTabs({ value, onChange, openCount, closedCount }: Props) {
  const counts: Record<SourceFilter, number | null> = {
    all: null,
    open: openCount,
    closed: closedCount,
  };

  return (
    <div className="rounded-2xl border border-obsidian-700/60 bg-obsidian-900/50 p-1.5">
      <div role="tablist" aria-label="Asset source type" className="grid grid-cols-3 gap-1.5">
        {TABS.map((tab) => {
          const active = value === tab.value;
          const count = counts[tab.value];
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.value)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? tab.activeClass
                  : 'border-transparent text-obsidian-300 hover:bg-obsidian-800/70 hover:text-obsidian-100'
              }`}
            >
              <tab.icon className={`h-4 w-4 ${active ? tab.iconClass : 'text-obsidian-400'}`} />
              <span className="truncate">{tab.label}</span>
              {count !== null && (
                <span className={`font-mono text-[11px] tabular-nums ${active ? 'opacity-90' : 'text-obsidian-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
