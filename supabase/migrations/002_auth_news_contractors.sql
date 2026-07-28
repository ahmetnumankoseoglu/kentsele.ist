-- Profiles (1:1 auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('malik', 'muteahhit', 'admin')),
  full_name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contractor verification
create table if not exists public.contractor_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  company_name text not null default '',
  tax_number text,
  city text not null default 'İstanbul',
  about text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contractor_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  doc_type text not null check (doc_type in (
    'vergi_levhasi', 'ticaret_sicil', 'imza_sirkuleri', 'yetki_belgesi', 'diger'
  )),
  file_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

-- Link listing to registered owner (claim after create)
alter table public.listings
  add column if not exists owner_user_id uuid references public.profiles (id) on delete set null;

create index if not exists listings_owner_idx on public.listings (owner_user_id);

-- News
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  body text not null,
  cover_image_url text,
  banner_image_url text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  author_name text not null default 'kentsele.ist Editör',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_status_pub_idx on public.news (status, published_at desc);

-- Comments on news (registered users)
create table if not exists public.news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 2 and 2000),
  status text not null default 'published'
    check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists news_comments_news_idx on public.news_comments (news_id, created_at desc);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role', 'malik');
  if r not in ('malik', 'muteahhit', 'admin') then
    r := 'malik';
  end if;
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    r,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone'
  );
  if r = 'muteahhit' then
    insert into public.contractor_profiles (user_id, company_name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'company_name', '')
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public listings: NEVER expose phone/email to anon
create or replace view public.listings_public as
select
  id,
  slug,
  ilce,
  mahalle,
  kat_sayisi,
  daire_sayisi,
  odeme_tercihi,
  aciklama,
  iletisim_adi,
  null::text as telefon,
  null::text as email,
  status,
  published_at,
  created_at,
  updated_at,
  case when status = 'anlasildi' then true else false end as contact_closed
from public.listings
where status in ('yayinda', 'teklif_saglaniyor', 'anlasildi');

-- Public news view
create or replace view public.news_public as
select
  id, slug, title, description, body,
  cover_image_url, banner_image_url,
  author_name, tags, published_at, created_at, updated_at
from public.news
where status = 'published';

-- RLS
alter table public.profiles enable row level security;
alter table public.contractor_profiles enable row level security;
alter table public.contractor_documents enable row level security;
alter table public.news enable row level security;
alter table public.news_comments enable row level security;

-- Profiles: own read/update
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

-- Contractors: own row
create policy contractor_select_own on public.contractor_profiles
  for select using (auth.uid() = user_id);
create policy contractor_update_own on public.contractor_profiles
  for update using (auth.uid() = user_id);

create policy contractor_docs_own on public.contractor_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- News: public read published via view; writes via service role only
grant select on public.news_public to anon, authenticated;
grant select on public.listings_public to anon, authenticated;

-- Comments: read published; insert own
create policy comments_select_published on public.news_comments
  for select using (status = 'published');
create policy comments_insert_own on public.news_comments
  for insert with check (auth.uid() = user_id);
create policy comments_delete_own on public.news_comments
  for delete using (auth.uid() = user_id);

-- Storage buckets (run in dashboard or storage API):
-- contractor-docs (private), news-images (public)

grant select on public.profiles to authenticated;
grant select, update on public.contractor_profiles to authenticated;
grant all on public.contractor_documents to authenticated;
grant select, insert, delete on public.news_comments to authenticated;
