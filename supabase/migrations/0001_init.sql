-- ============================================================
-- ReviewFlow — Initial Schema
-- Run in the Supabase SQL Editor or via `supabase db push`
-- ============================================================

-- --------------------------------------------------------
-- 1. Tables
-- --------------------------------------------------------

create table public.businesses (
  id            uuid        primary key default gen_random_uuid(),
  owner_user_id uuid        not null references auth.users (id) on delete cascade,
  name          text        not null,
  created_at    timestamptz not null    default now()
);

create table public.locations (
  id                uuid        primary key default gen_random_uuid(),
  business_id       uuid        not null references public.businesses (id) on delete cascade,
  name              text        not null,
  google_review_link text,
  brand_color       text        not null default '#2f6b4f',
  created_at        timestamptz not null default now()
);

create table public.qr_scans (
  id          uuid        primary key default gen_random_uuid(),
  location_id uuid        not null references public.locations (id) on delete cascade,
  scanned_at  timestamptz not null    default now()
);

create table public.feedback_events (
  id          uuid        primary key default gen_random_uuid(),
  location_id uuid        not null references public.locations (id) on delete cascade,
  type        text        not null check (type in ('good_tap', 'bad_tap', 'public_review_click', 'private_feedback')),
  message     text,
  created_at  timestamptz not null default now()
);

-- --------------------------------------------------------
-- 2. Indexes (common query patterns)
-- --------------------------------------------------------

create index idx_businesses_owner   on public.businesses  (owner_user_id);
create index idx_locations_business on public.locations    (business_id);
create index idx_qr_scans_location  on public.qr_scans    (location_id);
create index idx_feedback_location  on public.feedback_events (location_id);

-- --------------------------------------------------------
-- 3. Enable Row Level Security
-- --------------------------------------------------------

alter table public.businesses      enable row level security;
alter table public.locations       enable row level security;
alter table public.qr_scans        enable row level security;
alter table public.feedback_events enable row level security;

-- --------------------------------------------------------
-- 4. RLS Policies — businesses
--    Owner can SELECT / INSERT / UPDATE / DELETE their own rows.
-- --------------------------------------------------------

create policy "Owner can read own businesses"
  on public.businesses for select
  to authenticated
  using (auth.uid() = owner_user_id);

create policy "Owner can create businesses"
  on public.businesses for insert
  to authenticated
  with check (auth.uid() = owner_user_id);

create policy "Owner can update own businesses"
  on public.businesses for update
  to authenticated
  using  (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "Owner can delete own businesses"
  on public.businesses for delete
  to authenticated
  using (auth.uid() = owner_user_id);

-- --------------------------------------------------------
-- 5. RLS Policies — locations
--    Owner can manage locations that belong to a business they own.
-- --------------------------------------------------------

create policy "Owner can read own locations"
  on public.locations for select
  to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_user_id = auth.uid()
    )
  );

-- Anon users also need to read a location (QR scan page fetches brand_color, google_review_link, etc.)
create policy "Anyone can read location for QR flow"
  on public.locations for select
  to anon
  using (true);

create policy "Owner can create locations"
  on public.locations for insert
  to authenticated
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_user_id = auth.uid()
    )
  );

create policy "Owner can update own locations"
  on public.locations for update
  to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_user_id = auth.uid()
    )
  );

create policy "Owner can delete own locations"
  on public.locations for delete
  to authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- 6. RLS Policies — qr_scans
--    Anon can INSERT (public QR scan).
--    Business owner can SELECT.
-- --------------------------------------------------------

create policy "Anyone can log a QR scan"
  on public.qr_scans for insert
  to anon, authenticated
  with check (true);

create policy "Owner can read QR scans"
  on public.qr_scans for select
  to authenticated
  using (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  );

-- --------------------------------------------------------
-- 7. RLS Policies — feedback_events
--    Anon can INSERT (public feedback from customers).
--    Business owner can SELECT.
-- --------------------------------------------------------

create policy "Anyone can submit feedback"
  on public.feedback_events for insert
  to anon, authenticated
  with check (true);

create policy "Owner can read feedback events"
  on public.feedback_events for select
  to authenticated
  using (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  );
