-- Malik ilan formundaki imar / proje belgeleri (var / yok)
alter table public.listings
  add column if not exists belge_aplikasyon boolean not null default false,
  add column if not exists belge_imar_durum boolean not null default false,
  add column if not exists belge_istikamet_roleve boolean not null default false,
  add column if not exists belge_kot_kesit boolean not null default false;

-- Public view: belgeler müteahhit / ziyaretçi için görünür (telefon hâlâ gizli)
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
  case when status = 'anlasildi' then true else false end as contact_closed,
  belge_aplikasyon,
  belge_imar_durum,
  belge_istikamet_roleve,
  belge_kot_kesit
from public.listings
where status in ('yayinda', 'teklif_saglaniyor', 'anlasildi');
