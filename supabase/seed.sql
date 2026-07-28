-- Sample data for local/dev only.
-- Run AFTER migrations/001_listings.sql (SQL Editor or CLI).
-- Fixed manage_token values are for development convenience only — never use in production.

insert into public.listings (
  id,
  slug,
  ilce,
  mahalle,
  kat_sayisi,
  daire_sayisi,
  odeme_tercihi,
  aciklama,
  iletisim_adi,
  telefon,
  email,
  status,
  manage_token,
  published_at
) values
(
  '11111111-1111-1111-1111-111111111111',
  'kadikoy-5-kat-8-daire-kat-karsiligi-a1b2',
  'Kadıköy',
  'Moda',
  '5',
  '8',
  'kat_karsiligi',
  'Merkezi konumda, ruhsatı hazır kentsel dönüşüm binası. Kat karşılığı teklifler değerlendirilir.',
  'Ayşe Yılmaz',
  '05321234567',
  'ornek@example.com',
  'yayinda',
  'dev-manage-token-kadikoy-a1b2',
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'besiktas-4-kat-6-daire-hakedis-c3d4',
  'Beşiktaş',
  'Levent',
  '4',
  '6',
  'hakedis',
  'Hakediş modeline uygun arsa/bina. Müteahhit görüşmelerine açığız.',
  'Mehmet Demir',
  '05339876543',
  null,
  'yayinda',
  'dev-manage-token-besiktas-c3d4',
  now()
)
on conflict (id) do nothing;
