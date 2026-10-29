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
import { fetchSubmissions } from '@/lib/submissions';
import { fetchPlugins } from '@/lib/plugins';
import { fetchDirectoryStats } from '@/lib/assets';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
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

  useEffect(() => {
    let cancelled = false;
    const applyStats = (indexedAssets: number, toolsTracked: number) => {
      setStats((prev) => [
        { ...prev[0], value: indexedAssets },
        { ...prev[1], value: toolsTracked },
      ]);
    };

    const loadStats = () => {
      fetchDirectoryStats().then((live) => {
        if (!cancelled) applyStats(live.indexedAssets, live.toolsTracked);
      });
    };

    loadStats();

    if (!isSupabaseConfigured) return () => { cancelled = true; };

    const channel = supabase
      .channel('assets-live-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, loadStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plugins' }, loadStats)
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [refreshKey]);

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
      <AuthorProfileModal assets={[...communityAssets, ...pluginAssets]} />
      <AssetDetailModal />
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
