import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // The environment provisions these for the hosted build; they may not be
  // present in a freshly downloaded zip running locally without a .env.
  console.warn(
    '[ai-directory] Supabase env vars are missing. Submissions will run in local-only mode.',
  );
}

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
  {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  },
);

export const isSupabaseConfigured = Boolean(url && anonKey);
