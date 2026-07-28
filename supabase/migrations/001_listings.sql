create extension if not exists "pgcrypto";

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  ilce text not null,
  mahalle text,
  kat_sayisi text not null,
  daire_sayisi text not null,
  odeme_tercihi text not null check (odeme_tercihi in (
    'kat_karsiligi', 'hakedis', 'pesin', 'diger', 'belirsiz'
  )),
  aciklama text not null,
  iletisim_adi text not null,
  telefon text not null,
  email text,
  status text not null default 'incelemede' check (status in (
    'incelemede', 'yayinda', 'teklif_saglaniyor', 'anlasildi', 'kaldirildi'
  )),
  manage_token text not null unique,
  agreement_requested_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_idx on public.listings (status);
create index listings_ilce_idx on public.listings (ilce);
create index listings_created_at_idx on public.listings (created_at desc);
create index listings_agreement_req_idx on public.listings (agreement_requested_at)
  where agreement_requested_at is not null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

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
  case when status = 'anlasildi' then null else telefon end as telefon,
  case when status = 'anlasildi' then null else email end as email,
  status,
  published_at,
  created_at,
  updated_at
from public.listings
where status in ('yayinda', 'teklif_saglaniyor', 'anlasildi');

alter table public.listings enable row level security;

revoke all on public.listings from anon, authenticated;
grant select on public.listings_public to anon, authenticated;
