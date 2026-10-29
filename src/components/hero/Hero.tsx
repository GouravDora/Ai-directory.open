import { Sparkles, ArrowDown } from 'lucide-react';
import { StatCard } from './StatCard';
import { STAT_SOURCES } from './StatBar';

export function Hero({ stats }: { stats: typeof STAT_SOURCES }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-backdrop" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-obsidian-700/60 bg-obsidian-850/60 px-3 py-1 text-xs text-obsidian-200 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-neon-purple" />
            Curated rules · MCPs · system prompts
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-gradient sm:text-5xl lg:text-6xl animate-fade-in">
            The Universal Directory for AI Rules, MCPs &amp; Prompts
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-obsidian-200 animate-fade-in animate-delay-100">
            Discover, upvote and copy production-ready integration specs for every major AI
            ecosystem — all in one pristine, searchable board.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#directory"
            className="group inline-flex flex-col items-center gap-1.5 text-xs text-obsidian-300 transition-colors hover:text-obsidian-100"
          >
            Explore the board
            <ArrowDown className="h-4 w-4 animate-bounce text-neon-green/70 transition-colors group-hover:text-neon-green" />
          </a>
        </div>
      </div>
    </section>
  );
}
