import type { MouseEvent } from 'react';
import { User } from 'lucide-react';
import { openAuthorProfile } from '@/lib/router';

interface Props {
  name: string;
  className?: string;
  onNavigate?: () => void;
}

export function AuthorLink({ name, className = '', onNavigate }: Props) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AI';

  const go = (event: MouseEvent) => {
    event.stopPropagation();
    onNavigate?.();
    openAuthorProfile(name);
  };

  return (
    <button
      type="button"
      onClick={go}
      className={`mt-1 inline-flex items-center gap-1.5 text-[11px] text-obsidian-300 transition-colors hover:text-obsidian-100 ${className}`}
    >
      <span className="grid h-5 w-5 place-items-center rounded-full border border-obsidian-600 bg-obsidian-800 text-[9px] font-semibold text-obsidian-100">
        {initials || <User className="h-3 w-3" />}
      </span>
      by {name}
    </button>
  );
}
