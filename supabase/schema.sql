-- Enable UUID extension if needed
-- create extension if not exists "uuid-ossp";

-- profiles
create table if not exists public.profiles (
  user_id uuid primary key,
  email text unique,
  name text,
  created_at timestamp with time zone default now()
);

-- organograms
create table if not exists public.organograms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(user_id) on delete cascade,
  name text not null,
  data_json jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- versions
create table if not exists public.organogram_versions (
  id uuid primary key default gen_random_uuid(),
  organogram_id uuid references public.organograms(id) on delete cascade,
  data_json jsonb not null default '{}'::jsonb,
  metadata_json jsonb,
  created_at timestamp with time zone default now(),
  created_by uuid references public.profiles(user_id)
);

-- Indexes
create index if not exists organograms_owner_idx on public.organograms(owner_id);
create index if not exists organogram_versions_org_idx on public.organogram_versions(organogram_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.organograms enable row level security;
alter table public.organogram_versions enable row level security;

-- Policies
create policy if not exists "profiles self access" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "organograms read owner or public" on public.organograms
  for select using (auth.uid() = owner_id or is_public = true);

create policy if not exists "organograms modify owner" on public.organograms
  for insert with check (auth.uid() = owner_id)
  with check (true);

create policy if not exists "organograms update owner" on public.organograms
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy if not exists "versions read access linked to organogram" on public.organogram_versions
  for select using (exists(select 1 from public.organograms o where o.id = organogram_id and (o.owner_id = auth.uid() or o.is_public = true)));

create policy if not exists "versions insert owner" on public.organogram_versions
  for insert with check (exists(select 1 from public.organograms o where o.id = organogram_id and o.owner_id = auth.uid()));

