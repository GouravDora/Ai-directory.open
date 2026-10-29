import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  User as UserIcon,
  FolderOpen,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth, type UserProfile } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAccount } from '@/context/AccountContext';
import { navigate, profilePath } from '@/lib/router';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  action: 'profile' | 'submissions' | 'settings' | 'logout';
}

const MENU: MenuItem[] = [
  { label: 'View Profile', icon: UserIcon, action: 'profile' },
  { label: 'My Submissions', icon: FolderOpen, action: 'submissions' },
  { label: 'Settings', icon: Settings, action: 'settings' },
  { label: 'Log Out', icon: LogOut, action: 'logout' },
];

export function UserProfileMenu({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { notify } = useToast();
  const { open: openAccount } = useAccount();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleAction = (item: MenuItem) => {
    setOpen(false);
    if (item.action === 'logout') {
      logout();
      notify('You have been signed out.');
      return;
    }
    if (item.action === 'profile') {
      openProfile();
      return;
    }
    if (item.action === 'submissions' || item.action === 'settings') {
      openAccount(item.action);
    }
  };

  const openProfile = () => {
    setOpen(false);
    if (user.username) navigate(profilePath(user.username));
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <div className="flex items-center gap-1 rounded-full border border-obsidian-700/70 bg-obsidian-850/80 py-1 pl-1 pr-1 transition-all duration-200 hover:border-obsidian-500 hover:bg-obsidian-800">
        <button
          type="button"
          onClick={openProfile}
          aria-label="Open your profile"
          title="Open your profile"
          className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-obsidian-950 transition-transform duration-200 hover:scale-105"
          style={{ backgroundColor: user.hue, boxShadow: `0 0 12px -2px ${user.hue}` }}
        >
          {user.avatarInitials}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Account menu"
          className="flex items-center gap-1 pr-1.5"
        >
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-obsidian-100 sm:block">
            {user.name}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-obsidian-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 origin-top-right animate-slide-down overflow-hidden rounded-xl border border-obsidian-700/70 bg-obsidian-850/95 shadow-card backdrop-blur-xl">
          <div className="border-b border-obsidian-700/60 px-4 py-3">
            <p className="truncate text-sm font-semibold text-obsidian-100">{user.name}</p>
            <p className="truncate text-xs text-obsidian-300">{user.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-obsidian-700/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-obsidian-200">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: user.hue }}
              />
              via {user.provider}
            </span>
          </div>
          <nav className="p-1.5">
            {MENU.map((item) => {
              const isLogout = item.action === 'logout';
              return (
                <button
                  key={item.action}
                  type="button"
                  onClick={() => handleAction(item)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isLogout
                      ? 'text-rose-300 hover:bg-rose-500/10 hover:text-rose-200'
                      : 'text-obsidian-100 hover:bg-obsidian-700/60'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
