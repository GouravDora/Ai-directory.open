import { FileCode2, FileText, Layers, ScrollText, Users, UserCheck } from 'lucide-react';
import type { ProfileEntry, ProfileStats } from '@/lib/profiles';

interface Props {
  stats: ProfileStats;
  entries: ProfileEntry[];
}

interface StatCard {
  label: string;
  value: number;
  icon: typeof FileText;
}

export function ProfileStatCards({ stats, entries }: Props) {
  const cards: StatCard[] = [
    { label: 'Assets added', value: stats.assets + stats.plugins, icon: Layers },
    { label: 'Prompts added', value: entries.filter((e) => e.asset.systemPrompt.trim().length > 0).length, icon: FileText },
    { label: 'MCP servers', value: entries.filter((e) => e.asset.category === 'MCP Server').length, icon: FileCode2 },
    { label: 'Rules', value: entries.filter((e) => e.asset.frameworkRules.length > 0).length, icon: ScrollText },
    { label: 'Followers', value: stats.followers, icon: Users },
    { label: 'Following', value: stats.following, icon: UserCheck },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-xl border border-obsidian-700/60 bg-obsidian-900/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-green/40"
        >
          <card.icon className="mb-3 h-4 w-4 text-neon-green/80 transition-transform group-hover:scale-110" />
          <dd className="text-2xl font-semibold tabular-nums text-obsidian-100">{card.value}</dd>
          <dt className="mt-1 text-xs text-obsidian-300">{card.label}</dt>
        </div>
      ))}
    </dl>
  );
}
