# Supabase

## Migrations (SQL Editor sırayla)

1. `migrations/001_listings.sql`
2. `migrations/002_auth_news_contractors.sql`

## Dashboard ayarları

1. **Authentication → Providers**: Email açık.
2. **Storage**: `contractor-docs` bucket (private) oluştur.
3. API keys → `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, anon, service_role).

## Roller

| Rol | İlan ver | İlan düzenle | Numara gör | Haber yorum |
|-----|----------|--------------|------------|-------------|
| Misafir | ✅ | ❌ | ❌ | ❌ |
| Malik (kayıtlı) | ✅ | ✅ (token + claim) | ❌ | ✅ |
| Müteahhit onaysız | ✅ | — | ❌ | ✅ |
| Müteahhit onaylı | ✅ | — | ✅ | ✅ |
| Admin (şifre paneli) | tüm ilanlar | müteahhit onay | haber CRUD | — |

`listings_public` artık **telefon/e-posta döndürmez**. Numara yalnızca `/api/ilanlar/contact` ile onaylı müteahhitlere açılır.

## Haberler

- Admin: `/yonetim/haberler`
- Tablo yoksa seed haberler (`lib/content/haberler.ts`) gösterilir; seed’de yorum kapalıdır.
