import { FileText, Package } from 'lucide-react';

interface Props {
  hasInstallCommand: boolean;
  size?: 'sm' | 'md';
}

export function AssetTypeBadge({ hasInstallCommand, size = 'sm' }: Props) {
  const compact = size === 'sm';
  if (hasInstallCommand) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-violet-500 bg-violet-900/50 font-bold uppercase tracking-wide text-violet-300 ${
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <Package className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.4} />
        Software Plugin
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-900/50 font-bold uppercase tracking-wide text-emerald-300 ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <FileText className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} strokeWidth={2.4} />
      Text Asset
    </span>
  );
}
