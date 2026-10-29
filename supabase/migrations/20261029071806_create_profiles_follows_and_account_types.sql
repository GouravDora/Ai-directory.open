/*
# Create user profiles, follows, and account types

1. New Tables
- `profiles`: one public profile per signed-in account. Holds the username (used in the /profile/<username> address), display name, bio, and account type (personal or business).
- `follows`: records which profile follows which other profile.

2. Modified Tables
- `submissions` and `plugins` gain a `user_id` column that records which signed-in account created the entry. It fills in automatically for signed-in users and stays empty for anonymous submissions, so existing rows are untouched.
- `companies` gains an `owner_id` column. Business accounts own the companies they create and may edit them.

3. Automation
- A profile is created automatically whenever a new account signs up.
- Existing accounts receive a profile during this migration.

4. Security
- RLS is enabled on `profiles` and `follows`.
- Anyone can read profiles and follow relationships. Only the owner can edit their own profile or follow/unfollow with their own account.
- Business companies can only be edited by their owner.
- Account type can only be "personal" or "business".

5. Important notes
- Usernames are lowercase letters, numbers, dashes or underscores (3 to 30 characters) and are unique.
*/

CREATE OR REPLACE FUNCTION public.build_profile_username(p_display text, p_id uuid)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN length(base) >= 3 THEN base
    ELSE 'builder'
  END || '-' || substr(md5(p_id::text), 1, 6)
  FROM (
    SELECT left(lower(regexp_replace(COALESCE(p_display, ''), '[^a-zA-Z0-9]+', '', 'g')), 20) AS base
  ) AS cleaned;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  account_type text NOT NULL DEFAULT 'personal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_username_format CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  CONSTRAINT profiles_account_type_valid CHECK (account_type IN ('personal', 'business')),
  CONSTRAINT profiles_bio_length CHECK (char_length(bio) <= 280),
  CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) <= 80)
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles (username);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO anon, authenticated;
GRANT INSERT (id, username, display_name, bio, account_type) ON TABLE public.profiles TO authenticated;
GRANT UPDATE (username, display_name, bio, account_type, updated_at) ON TABLE public.profiles TO authenticated;

DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_profile" ON public.profiles;
CREATE POLICY "owner_insert_profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "owner_update_profile" ON public.profiles;
CREATE POLICY "owner_update_profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "no_delete_profiles" ON public.profiles;
CREATE POLICY "no_delete_profiles" ON public.profiles FOR DELETE TO anon, authenticated USING (false);

INSERT INTO public.profiles (id, username, display_name)
SELECT u.id,
       public.build_profile_username(COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), NULLIF(u.raw_user_meta_data->>'name', ''), split_part(u.email, '@', 1)), u.id),
       COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), NULLIF(u.raw_user_meta_data->>'name', ''), split_part(u.email, '@', 1), 'Builder')
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display text;
BEGIN
  display := COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1), 'Builder');
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, public.build_profile_username(display, NEW.id), left(display, 80))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_not_self CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS follows_following_id_idx ON public.follows (following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.follows FROM anon, authenticated;
GRANT SELECT ON TABLE public.follows TO anon, authenticated;
GRANT INSERT, DELETE ON TABLE public.follows TO authenticated;

DROP POLICY IF EXISTS "public_read_follows" ON public.follows;
CREATE POLICY "public_read_follows" ON public.follows FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_follows" ON public.follows;
CREATE POLICY "owner_insert_follows" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "no_update_follows" ON public.follows;
CREATE POLICY "no_update_follows" ON public.follows FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "owner_delete_follows" ON public.follows;
CREATE POLICY "owner_delete_follows" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid();
ALTER TABLE public.plugins ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid();
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS submissions_user_id_idx ON public.submissions (user_id);
CREATE INDEX IF NOT EXISTS plugins_user_id_idx ON public.plugins (user_id);
CREATE INDEX IF NOT EXISTS companies_owner_id_idx ON public.companies (owner_id);

GRANT UPDATE (name, description, website_url, logo_url) ON TABLE public.companies TO authenticated;

DROP POLICY IF EXISTS "owner_update_companies" ON public.companies;
CREATE POLICY "owner_update_companies" ON public.companies FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
