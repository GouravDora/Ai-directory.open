import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { SubmissionModalProvider } from '@/context/SubmissionModalContext';
import { ImportModalProvider } from '@/context/ImportModalContext';
import { BookmarkProvider } from '@/context/BookmarkContext';
import { AuthorProfileProvider } from '@/context/AuthorProfileContext';
import { AssetDetailProvider } from '@/context/AssetDetailContext';
import { PluginSubmissionProvider } from '@/context/PluginSubmissionContext';
import { CommunityProvider } from '@/context/CommunityContext';
import { AccountProvider } from '@/context/AccountContext';
import { Header } from '@/components/header/Header';
import { Hero } from '@/components/hero/Hero';
import { STAT_SOURCES, type StatSource } from '@/components/hero/StatBar';
import { DirectoryBoard } from '@/components/directory/DirectoryBoard';
import { Footer } from '@/components/Footer';
import { ToastViewport } from '@/components/toast/ToastViewport';
import { SubmissionModal } from '@/components/submission/SubmissionModal';
import { ImportModal } from '@/components/submission/ImportModal';
import { AuthorProfileModal } from '@/components/directory/AuthorProfileModal';
import { AssetDetailModal } from '@/components/directory/AssetDetailModal';
import { PluginSubmissionModal } from '@/components/submission/PluginSubmissionModal';
import { CommunityModal } from '@/components/community/CommunityModal';
import { AccountModal } from '@/components/header/AccountModal';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { parseProfileUsername, usePathname } from '@/lib/router';
import { useAuthorProfile } from '@/context/AuthorProfileContext';
import { fetchSubmissions, incrementUpvote } from '@/lib/submissions';
import { fetchPlugins, incrementPluginUpvote } from '@/lib/plugins';
import type { IntegrationAsset } from '@/data/integrations';

function AppShell() {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<StatSource[]>(STAT_SOURCES);
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookmarksActive, setBookmarksActive] = useState(false);
  const [communityAssets, setCommunityAssets] = useState<IntegrationAsset[]>([]);
  const [pluginAssets, setPluginAssets] = useState<IntegrationAsset[]>([]);
  const { selectedAuthor } = useAuthorProfile();
  const profileUsername = parseProfileUsername(usePathname());

  // Simulate a live directory: counts tick up periodically as new assets are "indexed".
  useEffect(() => {
    const id = window.setInterval(() => {
      setStats((prev) => [
        { ...prev[0], value: prev[0].value + Math.floor(Math.random() * 6) + 1 },
        {
          ...prev[1],
          value: prev[1].value + Math.floor(Math.random() * 4) + 1,
        },
      ]);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSubmissions(), fetchPlugins()]).then(([submissionRows, pluginRows]) => {
      if (!cancelled) {
        setCommunityAssets(submissionRows);
        setPluginAssets(pluginRows);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const heroStats = useMemo(() => stats, [stats]);

  const handleSubmitted = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setStats((prev) => [
      { ...prev[0], value: prev[0].value + 1 },
      { ...prev[1], value: prev[1].value + 1 },
    ]);
  }, []);

  const handleToggleBookmarks = useCallback(() => {
    setBookmarksActive((v) => !v);
  }, []);

  // Switching to author view should exit bookmarks-only mode
  useEffect(() => {
    if (selectedAuthor) setBookmarksActive(false);
  }, [selectedAuthor]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onQuery={setQuery}
        onToggleBookmarks={handleToggleBookmarks}
        bookmarksActive={bookmarksActive}
      />
      <main className="flex-1">
        {profileUsername ? (
          <ProfilePage key={profileUsername} username={profileUsername} />
        ) : (
          <>
            <Hero stats={heroStats} />
            <DirectoryBoard
              headerQuery={query}
              bookmarksOnly={bookmarksActive}
              communityAssets={[...communityAssets, ...pluginAssets]}
            />
          </>
        )}
      </main>
      <Footer />
      <ToastViewport />
      <SubmissionModal onSubmitted={handleSubmitted} />
      <PluginSubmissionModal onSubmitted={handleSubmitted} />
      <CommunityModal />
      <AccountModal assets={[...communityAssets, ...pluginAssets]} />
      <ImportModal onImported={handleSubmitted} />
      <AuthorProfileModal assets={communityAssets} />
      <AssetDetailModal onUpvote={(asset) => {
        if (asset.id.startsWith('sub-')) {
          incrementUpvote(asset.id.slice(4));
        } else if (asset.id.startsWith('plugin-')) {
          incrementPluginUpvote(asset.id.slice(7));
        }
      }} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookmarkProvider>
          <AuthorProfileProvider>
            <AssetDetailProvider>
              <PluginSubmissionProvider>
                <CommunityProvider>
                  <AccountProvider>
                    <SubmissionModalProvider>
                    <ImportModalProvider>
                      <AppShell />
                    </ImportModalProvider>
                    </SubmissionModalProvider>
                  </AccountProvider>
                </CommunityProvider>
              </PluginSubmissionProvider>
            </AssetDetailProvider>
          </AuthorProfileProvider>
        </BookmarkProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
