# Storage: `contractor-docs` bucket

Kod bu bucket ile uyumludur. Değiştirmeyin: **bucket adı**, **private**, path formatı.

## Kod ne bekliyor?

| Ayar | Değer |
|------|--------|
| Bucket adı | `contractor-docs` (tire ile, tam bu string) |
| Public | **Hayır** (private) |
| Max dosya | 10 MB |
| MIME | `application/pdf`, `image/jpeg`, `image/png`, `image/webp` |
| Path | `{user_id}/{timestamp}-{doc_type}.{ext}` |
| Upload API | `POST /api/muteahhit/documents` → **service_role** |
| Admin görüntüleme | signed URL 30 dk (`createSignedUrl`) |

## Yöntem A — SQL (önerilen)

Supabase → **SQL Editor** → `migrations/008_storage_contractor_docs.sql` içeriğini çalıştır.

## Yöntem B — Dashboard (elle)

1. **Storage → New bucket**
2. Name: `contractor-docs`
3. **Public bucket: OFF**
4. File size limit: `10` MB
5. Allowed MIME types (opsiyonel ama önerilir):
   - `application/pdf`
   - `image/jpeg`
   - `image/png`
   - `image/webp`
6. Create

Policies (Dashboard → Storage → contractor-docs → Policies):

- Authenticated **INSERT/SELECT/DELETE** only when first folder = `auth.uid()`
- Veya hiç client policy koyma; API zaten **service_role** ile yükler (en basit)

## Test

1. Müteahhit hesabı ile giriş → `/muteahhit` → PDF/JPG yükle  
2. Admin → Müteahhitler → belgeler → “Görüntüle” (signed URL)  
3. Hata alırsan: bucket adı, private, `SUPABASE_SERVICE_ROLE_KEY` env

## Uyumluluk özeti

Mevcut kod **değişmeden** bu bucket ile çalışır. Ekstra kod gerekmez; bucket + service role key yeterli.
