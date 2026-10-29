import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function LocalSearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search assets…'}
        className="w-full rounded-lg border border-obsidian-700/70 bg-obsidian-950/60 py-2 pl-9 pr-9 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all focus:border-emerald-500/50 focus:bg-obsidian-900/60"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-obsidian-300 transition-colors hover:text-obsidian-100"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
