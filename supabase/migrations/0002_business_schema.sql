-- 0002_business_schema.sql

-- The businesses table already exists from 0001_init.sql, so we ALTER it
-- to match the requested schema instead of dropping it (which would break foreign keys).

-- 1. Rename existing owner_user_id to owner_id
ALTER TABLE public.businesses RENAME COLUMN owner_user_id TO owner_id;

-- 2. Add the new required columns
ALTER TABLE public.businesses 
  ADD COLUMN industry TEXT NOT NULL DEFAULT 'Unspecified',
  ADD COLUMN google_review_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN ai_keywords TEXT;

-- Remove the default now that existing rows are populated (if any)
ALTER TABLE public.businesses ALTER COLUMN industry DROP DEFAULT;
ALTER TABLE public.businesses ALTER COLUMN google_review_url DROP DEFAULT;

-- 3. Replace RLS Policies
-- First drop old policies related to businesses
DROP POLICY IF EXISTS "Owner can read own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owner can create businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owner can update own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owner can delete own businesses" ON public.businesses;

-- Policy 1 (Authenticated Owners): A business owner can only SELECT, INSERT, UPDATE, and DELETE rows where their user ID matches the owner_id.
CREATE POLICY "Authenticated Owners" ON public.businesses
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy 2 (Public Read): Anyone (anon) can SELECT a business row.
CREATE POLICY "Public Read" ON public.businesses
  FOR SELECT
  TO anon
  USING (true);
