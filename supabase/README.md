# Supabase

kentsele.ist veritabanı, auth ve storage kurulumu.

## Migrations (SQL Editor sırayla)

1. `migrations/001_listings.sql`
2. `migrations/002_auth_news_contractors.sql`
3. `migrations/003_listing_belgeler.sql` — imar belge checkbox alanları
4. `migrations/004_listing_ada_parsel.sql` — ada/parsel (public view’da yok)
5. `migrations/005_contact_messages.sql` — site iletişim formu
6. `migrations/006_rls_lockdown.sql` — rol / müteahhit onay alanlarını client’tan kilitle
7. `migrations/007_contact_replies.sql` — iletişim formu admin cevabı alanları
8. `migrations/008_storage_contractor_docs.sql` — private `contractor-docs` bucket
9. `migrations/009_admin_verification_trigger.sql` — admin müteahhit onayı (service_role serbest)
10. `migrations/010_admin_set_contractor_verification.sql` — **zorunlu** admin Onayla/Reddet (RPC + bypass)
11. `seed.sql` — isteğe bağlı örnek ilanlar (geliştirme)

### Müteahhit Onayla butonu çalışmıyorsa

Supabase → SQL Editor → New query → `010_admin_set_contractor_verification.sql` içeriğini yapıştır → **Run**.
Sonra admin panelde Onayla’ya tekrar bas.

## Dashboard ayarları

1. **Authentication → Providers**: Email açık.
2. **Storage**: `contractor-docs` — detay: [`STORAGE.md`](./STORAGE.md) (SQL 008 veya elle).
3. API keys → `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, anon, service_role).
4. **Admin paneli**: `.env.local` içinde `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET`.

## Roller

| Rol | İlan ver | İlan düzenle | Numara gör | Haber yorum |
|-----|----------|--------------|------------|-------------|
| Misafir | ✅ | ❌ | ❌ | ❌ |
| Malik (kayıtlı) | ✅ | ✅ (token + e-posta eşleşmesi) | ❌ | ✅ |
| Müteahhit onaysız | ❌ | — | ❌ | ✅ |
| Müteahhit onaylı | ❌ | — | ✅ | ✅ |
| Admin (şifre paneli) | tüm ilanlar | müteahhit onay | haber CRUD | — |

`listings_public` **telefon/e-posta döndürmez**. Numara yalnızca `/api/ilanlar/contact` ile onaylı müteahhitlere açılır.

## Haberler

- Admin: `/yonetim/haberler`
- Tablo yoksa seed haberler (`lib/content/haberler.ts`) gösterilir; seed’de yorum kapalıdır.
