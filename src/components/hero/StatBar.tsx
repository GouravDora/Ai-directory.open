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
    value: 0,
    icon: Database,
  },
  {
    label: 'AI Tools Tracked',
    sublabel: 'Unique authors in the catalog',
    value: 0,
    icon: Users,
  },
];
