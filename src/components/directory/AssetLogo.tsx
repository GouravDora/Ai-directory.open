import { useState } from 'react';
import type { IntegrationAsset } from '@/data/integrations';

interface Props {
  asset: IntegrationAsset;
  size?: 'sm' | 'lg';
}

export function AssetLogo({ asset, size = 'sm' }: Props) {
  const [broken, setBroken] = useState(false);
  const Icon = asset.icon;
  const Logo = asset.logo;
  const accentText = asset.accent === 'green' ? 'text-emerald-400' : 'text-violet-400';
  const accentSoft =
    asset.accent === 'green'
      ? 'bg-emerald-500/10 border-emerald-500/20'
      : 'bg-violet-500/10 border-violet-500/20';
  const box = size === 'lg' ? 'h-14 w-14 rounded-xl' : 'h-12 w-12 rounded-xl';
  const glyph = size === 'lg' ? 'h-8 w-8' : 'h-7 w-7';
  const fallback = size === 'lg' ? 'h-7 w-7' : 'h-6 w-6';
  const image = size === 'lg' ? 'h-10 w-10' : 'h-9 w-9';

  return (
    <span className={`grid ${box} shrink-0 place-items-center overflow-hidden border bg-obsidian-800 ${accentSoft}`}>
      {asset.logoUrl && !broken ? (
        <img
          src={asset.logoUrl}
          alt={`${asset.name} logo`}
          className={`${image} rounded-lg object-cover`}
          onError={() => setBroken(true)}
        />
      ) : Logo ? (
        <Logo className={`${glyph} ${accentText}`} />
      ) : (
        <Icon className={`${fallback} ${accentText}`} strokeWidth={1.75} />
      )}
    </span>
  );
}
