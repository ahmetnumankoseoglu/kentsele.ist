-- Dükkan sayısı (daire ile birlikte; 0 olabilir)
alter table public.listings
  add column if not exists dukkan_sayisi text not null default '0';

-- CREATE OR REPLACE VIEW, sütun sırası değişince isim kaydırır → önce DROP
drop view if exists public.listings_public;

create view public.listings_public as
select
  id,
  slug,
  ilce,
  mahalle,
  kat_sayisi,
  daire_sayisi,
  dukkan_sayisi,
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

grant select on public.listings_public to anon, authenticated;
