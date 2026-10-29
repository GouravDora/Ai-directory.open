import { useEffect, useState } from 'react';

const PROFILE_PATH = /^\/profile\/([a-z0-9_-]{3,30})\/?$/;

export function profilePath(username: string): string {
  return `/profile/${username}`;
}

export function toAuthorUsername(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  if (slug.length >= 3) return slug;
  return `${slug || 'user'}-author`.slice(0, 30);
}

export function openAuthorProfile(name: string): void {
  navigate(profilePath(toAuthorUsername(name)));
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
