import { Database, Users } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

export interface StatSource {
  label: string;
  sublabel: string;
  value: number;
  icon: LucideIcon;
}

export const STAT_SOURCES: StatSource[] = [
  {
    label: 'Indexed Assets',
    sublabel: 'Live across the directory',
    value: 8421,
    icon: Database,
  },
  {
    label: 'AI Tools Tracked',
    sublabel: 'Across 7 categories',
    value: 66,
    icon: Users,
  },
];
