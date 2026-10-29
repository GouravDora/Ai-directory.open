import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { ADD_TO_TOOL_TARGETS, type AddToolTarget } from '@/data/officialSites';
import { useToast } from '@/context/ToastContext';
import { copyText } from '@/lib/exportAsset';

interface Props {
  text: string;
}

export function AddToToolMenu({ text }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = async (target: AddToolTarget) => {
    setOpen(false);
    window.open(target.url, '_blank', 'noopener,noreferrer');
    const copied = await copyText(text);
    if (copied) {
      notify(`Copied! Paste this into ${target.label}`);
    } else {
      notify('Could not access clipboard.', 'error');
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-primary border border-neon-green/40 bg-neon-green/10 px-4 text-sm text-neon-green shadow-neon-green hover:bg-neon-green/20"
      >
        Add to Tool
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-56 animate-slide-down overflow-hidden rounded-xl border border-obsidian-700/70 bg-obsidian-900/95 p-1.5 shadow-card backdrop-blur-xl"
        >
          {ADD_TO_TOOL_TARGETS.map((target) => (
            <button
              key={target.key}
              type="button"
              role="menuitem"
              onClick={() => choose(target)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-obsidian-100 transition-colors hover:bg-obsidian-800 hover:text-neon-green"
            >
              {target.label}
              <ExternalLink className="h-3.5 w-3.5 text-obsidian-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
