/*
# Stacks (user-owned collections of assets)

1. New Tables
- `stacks`: a user's named collection of assets, similar to GitHub Collections.
  - Columns: id, user_id, name, description, created_at.
- `stack_items`: the assets inside a stack.
  - Columns: stack_id, asset_id, created_at. PK (stack_id, asset_id).

2. Security
- RLS enabled on both tables. Anyone can read stacks and stack items.
- Only the stack owner can create/update/delete their stacks and manage items.
- Stack item insert/delete is gated on the caller owning the parent stack.
*/

CREATE TABLE IF NOT EXISTS public.stacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stacks_user_id_idx ON public.stacks (user_id);
CREATE INDEX IF NOT EXISTS stacks_created_at_idx ON public.stacks (created_at DESC);

ALTER TABLE public.stacks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stacks FROM anon, authenticated;
GRANT SELECT ON TABLE public.stacks TO anon, authenticated;
GRANT INSERT (user_id, name, description) ON TABLE public.stacks TO authenticated;
GRANT UPDATE (name, description) ON TABLE public.stacks TO authenticated;
GRANT DELETE ON TABLE public.stacks TO authenticated;

DROP POLICY IF EXISTS "public_read_stacks" ON public.stacks;
CREATE POLICY "public_read_stacks" ON public.stacks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_stacks" ON public.stacks;
CREATE POLICY "owner_insert_stacks" ON public.stacks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_stacks" ON public.stacks;
CREATE POLICY "owner_update_stacks" ON public.stacks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_stacks" ON public.stacks;
CREATE POLICY "owner_delete_stacks" ON public.stacks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.stack_items (
  stack_id uuid NOT NULL REFERENCES public.stacks(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (stack_id, asset_id)
);

CREATE INDEX IF NOT EXISTS stack_items_stack_id_idx ON public.stack_items (stack_id);
CREATE INDEX IF NOT EXISTS stack_items_asset_id_idx ON public.stack_items (asset_id);

ALTER TABLE public.stack_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stack_items FROM anon, authenticated;
GRANT SELECT ON TABLE public.stack_items TO anon, authenticated;
GRANT INSERT (stack_id, asset_id) ON TABLE public.stack_items TO authenticated;
GRANT DELETE ON TABLE public.stack_items TO authenticated;

DROP POLICY IF EXISTS "public_read_stack_items" ON public.stack_items;
CREATE POLICY "public_read_stack_items" ON public.stack_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_stack_items" ON public.stack_items;
CREATE POLICY "owner_insert_stack_items" ON public.stack_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.stacks WHERE id = stack_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_delete_stack_items" ON public.stack_items;
CREATE POLICY "owner_delete_stack_items" ON public.stack_items FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.stacks WHERE id = stack_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "no_update_stack_items" ON public.stack_items;
CREATE POLICY "no_update_stack_items" ON public.stack_items FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);
