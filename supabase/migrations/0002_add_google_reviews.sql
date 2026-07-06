-- --------------------------------------------------------
-- 1. Create table
-- --------------------------------------------------------

create table public.google_reviews (
  id            uuid        primary key default gen_random_uuid(),
  location_id   uuid        not null references public.locations (id) on delete cascade,
  author_name   text        not null,
  rating        int         not null check (rating >= 1 and rating <= 5),
  review_text   text,
  ai_response   text,
  created_at    timestamptz not null default now(),
  responded_at  timestamptz
);

-- --------------------------------------------------------
-- 2. Indexes
-- --------------------------------------------------------

create index idx_google_reviews_location on public.google_reviews (location_id);

-- --------------------------------------------------------
-- 3. Enable RLS
-- --------------------------------------------------------

alter table public.google_reviews enable row level security;

-- --------------------------------------------------------
-- 4. RLS Policies
-- --------------------------------------------------------

create policy "Owner can read own google_reviews"
  on public.google_reviews for select
  to authenticated
  using (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  );

create policy "Owner can update own google_reviews"
  on public.google_reviews for update
  to authenticated
  using (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  );

create policy "Owner can insert own google_reviews"
  on public.google_reviews for insert
  to authenticated
  with check (
    exists (
      select 1 from public.locations l
      join public.businesses b on b.id = l.business_id
      where l.id = location_id
        and b.owner_user_id = auth.uid()
    )
  );
