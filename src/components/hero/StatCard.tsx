import { Database, Users } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { type StatSource } from './StatBar';

export function StatCard({ stat }: { stat: StatSource }) {
  const animated = useCountUp(stat.value);
  return (
    <div className="card-surface group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:border-obsidian-500/70">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-neon-green/5 blur-2xl transition-opacity duration-300 group-hover:bg-neon-green/10" />
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-obsidian-700/70 bg-obsidian-800 text-neon-green">
          <stat.icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-obsidian-300">
          {stat.label}
        </span>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-obsidian-100 sm:text-4xl">
        {animated.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-obsidian-300">{stat.sublabel}</p>
    </div>
  );
}
