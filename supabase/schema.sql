-- Enable UUID generation (Supabase já dispõe do pgcrypto)
create extension if not exists pgcrypto;

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

-- Policies (CREATE POLICY não suporta IF NOT EXISTS)
-- Remova políticas antigas se necessário:
-- drop policy if exists "profiles self access" on public.profiles;
-- drop policy if exists "organograms read owner or public" on public.organograms;
-- drop policy if exists "organograms insert owner" on public.organograms;
-- drop policy if exists "organograms update owner" on public.organograms;
-- drop policy if exists "versions read access linked to organogram" on public.organogram_versions;
-- drop policy if exists "versions insert owner" on public.organogram_versions;

create policy "profiles self access" on public.profiles
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "organograms read owner or public" on public.organograms
  for select
  to authenticated
  using (auth.uid() = owner_id or is_public = true);

create policy "organograms insert owner" on public.organograms
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "organograms update owner" on public.organograms
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "versions read access linked to organogram" on public.organogram_versions
  for select
  to authenticated
  using (
    exists(
      select 1 from public.organograms o
      where o.id = organogram_id
        and (o.owner_id = auth.uid() or o.is_public = true)
    )
  );

create policy "versions insert owner" on public.organogram_versions
  for insert
  to authenticated
  with check (
    exists(
      select 1 from public.organograms o
      where o.id = organogram_id
        and o.owner_id = auth.uid()
    )
  );
