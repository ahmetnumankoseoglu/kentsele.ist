-- İsteğe bağlı örnek ilanlar (geliştirme / boş DB smoke test)
-- Sıra: 001 → 002 → 003 → 004 → 005 → bu dosya

insert into public.listings (
  id, slug, ilce, mahalle, ada, parsel, kat_sayisi, daire_sayisi, dukkan_sayisi, odeme_tercihi,
  aciklama, iletisim_adi, telefon, email, status, manage_token, published_at,
  belge_aplikasyon, belge_imar_durum, belge_istikamet_roleve, belge_kot_kesit
) values
(
  '11111111-1111-1111-1111-111111111111',
  'kadikoy-5-kat-8-daire-kat-karsiligi-a1b2',
  'Kadıköy', 'Caferağa', '1234', '56', '5', '8', '2', 'kat_karsiligi',
  'Merkezi konumda kentsel dönüşüm binası. Riskli yapı raporu alındı, kat karşılığı teklifler değerlendirilir. Aplikasyon ve imar durumu mevcut.',
  'Ayşe Yılmaz', '05321234567', 'ornek.malik@example.com',
  'yayinda', 'dev-manage-token-kadikoy-a1b2', now(),
  true, true, false, false
),
(
  '22222222-2222-2222-2222-222222222222',
  'besiktas-4-kat-6-daire-hakedis-c3d4',
  'Beşiktaş', 'Levent', '88', '12', '4', '6', '0', 'hakedis',
  'Hakediş modeline uygun arsa/bina. Müteahhit görüşmelerine açığız. Kot-kesit ve istikamet rölevesi var.',
  'Mehmet Demir', '05339876543', null,
  'yayinda', 'dev-manage-token-besiktas-c3d4', now(),
  false, true, true, true
),
(
  '33333333-3333-3333-3333-333333333333',
  'uskudar-6-kat-12-daire-kat-karsiligi-e5f6',
  'Üsküdar', 'Altunizade', '401', '3', '6', '12', '1', 'kat_karsiligi',
  'Üsküdar Altunizade’de 6 kat 12 daire hedefli dönüşüm. Malikler anlaşmış durumda, müteahhit arıyoruz.',
  'Zeynep Kaya', '05325550123', 'zeynep@example.com',
  'teklif_saglaniyor', 'dev-manage-token-uskudar-e5f6', now(),
  true, true, true, true
)
on conflict (id) do update set
  aciklama = excluded.aciklama,
  belge_aplikasyon = excluded.belge_aplikasyon,
  belge_imar_durum = excluded.belge_imar_durum,
  belge_istikamet_roleve = excluded.belge_istikamet_roleve,
  belge_kot_kesit = excluded.belge_kot_kesit,
  status = excluded.status,
  published_at = excluded.published_at;
