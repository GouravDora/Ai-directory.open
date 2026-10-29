import { SlidersHorizontal, ArrowUpDown, Layers, Lock, Unlock } from 'lucide-react';
import {
  CATEGORY_FILTERS,
  SORT_OPTIONS,
  type AssetCategory,
  type SortOption,
  type SourceFilter,
  LANGUAGE_FILTERS,
} from '@/data/integrations';

interface Props {
  active: AssetCategory | 'All';
  onChange: (c: AssetCategory | 'All') => void;
  resultCount: number;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  source: SourceFilter;
  onSourceChange: (source: SourceFilter) => void;
}

const SOURCE_FILTERS: { value: SourceFilter; label: string; icon: typeof Unlock; iconClass: string }[] = [
  { value: 'all', label: 'All', icon: Layers, iconClass: 'text-obsidian-200' },
  { value: 'open', label: 'Open Source', icon: Unlock, iconClass: 'text-neon-green' },
  { value: 'closed', label: 'Closed Source', icon: Lock, iconClass: 'text-obsidian-400' },
];

export function FilterBar({
  active,
  onChange,
  resultCount,
  sort,
  onSortChange,
  language,
  onLanguageChange,
  source,
  onSourceChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SOURCE_FILTERS.map((item) => {
            const isActive = source === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onSourceChange(item.value)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? item.value === 'open'
                      ? 'border border-neon-green/40 bg-neon-green/10 text-neon-green'
                      : item.value === 'closed'
                        ? 'border border-obsidian-500 bg-obsidian-800 text-obsidian-200'
                        : 'border border-obsidian-400/40 bg-obsidian-800 text-obsidian-100'
                    : 'border border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
                }`}
              >
                <item.icon className={`h-3.5 w-3.5 ${isActive || item.value === 'open' ? item.iconClass : 'text-obsidian-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-obsidian-300" />
        {CATEGORY_FILTERS.map((f) => {
          const isActive = active === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border border-obsidian-700/60 bg-obsidian-850/60 text-obsidian-200 hover:border-obsidian-500 hover:text-obsidian-100'
              }`}
            >
              {f.label}
            </button>
          );
        })}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pl-6">
          <span className="shrink-0 text-[10px] uppercase tracking-wide text-obsidian-400">Language</span>
          {LANGUAGE_FILTERS.map((item) => (
            <button key={item} type="button" onClick={() => onLanguageChange(item)} className={`shrink-0 rounded-md px-2 py-1 text-[11px] transition-colors ${language === item ? 'bg-emerald-500/10 text-emerald-400' : 'text-obsidian-300 hover:text-obsidian-100'}`}>{item}</button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-obsidian-300" />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSortChange(opt.value)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                sort === opt.value
                  ? 'bg-obsidian-700 text-obsidian-100'
                  : 'text-obsidian-300 hover:text-obsidian-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-obsidian-300">
          <span className="font-mono text-obsidian-100">{resultCount}</span> assets
        </p>
      </div>
    </div>
  );
}
