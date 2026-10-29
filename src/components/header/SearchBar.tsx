import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function SearchBar({ onQuery }: { onQuery: (q: string) => void }) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-300"
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onQuery(e.target.value);
        }}
        placeholder="Search assets, MCPs, prompts…"
        className="h-10 w-full rounded-xl border border-obsidian-700/70 bg-obsidian-850/70 pl-10 pr-10 text-sm text-obsidian-100 placeholder:text-obsidian-300 outline-none transition-all duration-200
          focus:border-neon-green/50 focus:bg-obsidian-800/80 focus:shadow-neon-green"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue('');
            onQuery('');
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-obsidian-300 transition-colors hover:bg-obsidian-700 hover:text-obsidian-100"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-obsidian-700 bg-obsidian-800 px-1.5 py-0.5 font-mono text-[10px] text-obsidian-300 lg:block">
          ⌘K
        </kbd>
      )}
    </div>
  );
}
