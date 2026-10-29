import { Hexagon } from 'lucide-react';

export function BrandMark() {
  return (
    <a href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center">
        <Hexagon
          className="h-9 w-9 text-neon-green transition-all duration-300 group-hover:text-neon-purple"
          strokeWidth={1.5}
          fill="rgba(57,255,136,0.06)"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="text-[11px] font-bold tracking-tighter text-neon-green transition-colors duration-300 group-hover:text-neon-purple">
            ai
          </span>
        </span>
      </span>
      <span className="font-mono text-base font-semibold tracking-tight text-obsidian-100">
        ai-directory<span className="text-neon-green">.in</span>
      </span>
    </a>
  );
}
