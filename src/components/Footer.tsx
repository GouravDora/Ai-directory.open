import { useEffect, useState } from 'react';
import { Hexagon, Github, Twitter, Heart, Mail, X } from 'lucide-react';

const CONTACT_EMAIL = 'hello@ai-directory.in';
const GITHUB_URL = 'https://github.com/';
const X_URL = 'https://x.com/';

type InfoKey = 'about' | 'privacy' | 'terms';

const INFO_PAGES: Record<InfoKey, { title: string; paragraphs: string[] }> = {
  about: {
    title: 'About ai-directory.in',
    paragraphs: [
      'ai-directory.in is a community directory of AI system prompts, framework rules, MCP servers and prompts that builders can copy, install and share.',
      'Every asset lists what it does, how to connect it, and where to learn more, so you can pick the right tool for your workflow faster.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    paragraphs: [
      'We store the account details you give us when you sign in (name, email and provider), plus the assets, upvotes, bookmarks and profile information you choose to create.',
      'We do not sell your personal data. You can ask us to delete your account and its content by contacting us at the email address below.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    paragraphs: [
      'Assets on this directory are submitted by the community. Review any prompt, rule or connection string before you run it in your own tools.',
      'Do not submit content you do not have the right to share, and do not use the directory for abusive or unlawful purposes. We may remove content that breaks these rules.',
    ],
  },
};

const INFO_LINKS: { key: InfoKey; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms of Service' },
];

function InfoModal({ infoKey, onClose }: { infoKey: InfoKey; onClose: () => void }) {
  const page = INFO_PAGES[infoKey];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[80] grid place-items-center bg-obsidian-950/80 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg animate-slide-down rounded-2xl border border-obsidian-700/70 bg-obsidian-900/95 p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-obsidian-100">{page.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-obsidian-300 transition-colors hover:bg-obsidian-700/60 hover:text-obsidian-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-obsidian-200">
          {page.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [openInfo, setOpenInfo] = useState<InfoKey | null>(null);

  return (
    <footer className="mt-10 border-t border-obsidian-800/80 bg-obsidian-950/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Hexagon className="h-6 w-6 text-neon-green" strokeWidth={1.5} />
            <span className="font-mono text-sm font-semibold text-obsidian-100">
              ai-directory<span className="text-neon-green">.in</span>
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-obsidian-300">
            {INFO_LINKS.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => setOpenInfo(link.key)}
                className="transition-colors hover:text-obsidian-100"
              >
                {link.label}
              </button>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-obsidian-100">
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4 text-obsidian-300">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-obsidian-100"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-obsidian-100"
              aria-label="X"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 border-t border-obsidian-800/80 pt-6 text-center text-xs text-obsidian-300">
          <p className="inline-flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-neon-purple" /> for the AI builder community
          </p>
          <p className="mt-1">© {new Date().getFullYear()} ai-directory.in — Universal AI Rules, MCPs &amp; Prompts</p>
        </div>
      </div>
      {openInfo && <InfoModal infoKey={openInfo} onClose={() => setOpenInfo(null)} />}
    </footer>
  );
}
