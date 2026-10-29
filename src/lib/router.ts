import { useEffect, useState } from 'react';

const PROFILE_PATH = /^\/profile\/([a-z0-9_-]{3,30})\/?$/;

export function profilePath(username: string): string {
  return `/profile/${username}`;
}

export function parseProfileUsername(pathname: string): string | null {
  const match = PROFILE_PATH.exec(pathname.toLowerCase());
  return match ? match[1] : null;
}

export function navigate(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  window.scrollTo({ top: 0 });
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return pathname;
}
