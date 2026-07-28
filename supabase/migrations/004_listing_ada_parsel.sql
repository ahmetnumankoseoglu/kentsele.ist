-- Ada / parsel: yalnızca onaylı müteahhit + admin + malik (yönetim) görür.
-- Public view'a EKLENMEZ.
alter table public.listings
  add column if not exists ada text,
  add column if not exists parsel text;

-- Public view: mahalle herkese açık; ada/parsel yok
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
