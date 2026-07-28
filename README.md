# kentsele.ist

İstanbul kentsel dönüşüm ilan panosu. Malikler ücretsiz ve kayıtsız ilan verir; müteahhitler kayıt + belge onayı sonrası iletişime geçer.

## Stack

- **Next.js** (App Router, TypeScript, Tailwind CSS)
- **Supabase** (Postgres + RLS; public okuma `listings_public` view üzerinden)
- **Zod** validasyon, **Vitest** unit testler

## Kurulum

### 1. Ortam değişkenleri

```bash
cp .env.example .env.local
```

`.env.local` içinde doldur:

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (sadece sunucu; gizli tut) |
| `ADMIN_PASSWORD` | Admin paneli şifresi |
| `ADMIN_SESSION_SECRET` | Cookie imzası için rastgele gizli dize |
| `NEXT_PUBLIC_SITE_URL` | Site kökü (örn. `http://localhost:3000`) |

### 2. Veritabanı

Supabase SQL Editor’da migration’ı uygula:

- [`supabase/migrations/001_listings.sql`](supabase/migrations/001_listings.sql)
- [`supabase/migrations/002_auth_news_contractors.sql`](supabase/migrations/002_auth_news_contractors.sql)

Adımlar için: [`supabase/README.md`](supabase/README.md)

İsteğe bağlı örnek veri (migration’dan sonra):

```bash
# SQL Editor’da seed.sql içeriğini çalıştır
# veya: supabase db execute --file supabase/seed.sql
```

### 3. Bağımlılıklar ve geliştirme sunucusu

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

### 4. Test

```bash
npm test
```

### 5. Production build

```bash
npm run build
npm start
```

## Admin

- Giriş: [`/yonetim`](http://localhost:3000/yonetim)
- Şifre: `.env.local` içindeki `ADMIN_PASSWORD`
- İlan listesi ve durum yönetimi: `/yonetim/ilanlar`

## Rotalar

| Rota | Açıklama |
|------|----------|
| `/` | Ana sayfa — yayındaki ilanlar, ilçe filtresi |
| `/ilanlar` | Liste alias (ana sayfaya yönlendirir) |
| `/ilan/[slug]` | İlan detay |
| `/ilan-ver` | Yeni ilan formu (wizard) |
| `/ilan-ver/basarili` | Başarılı gönderim + yönetim linki |
| `/yonet/[token]` | Malik paneli (manage token ile) |
| `/yonetim` | Admin giriş |
| `/yonetim/ilanlar` | Admin ilan listesi |
| `/yonetim/ilanlar/[id]` | Admin ilan detay / durum |
| `POST /api/ilanlar` | Yeni ilan oluştur |
| `PATCH /api/yonet/[token]` | Malik güncelleme / anlaşma bildirimi |
| `POST /api/yonetim/login` | Admin oturum aç |
| `POST /api/yonetim/logout` | Admin oturum kapat |
| `PATCH /api/yonetim/ilanlar/[id]` | Admin ilan güncelle |

## Scripts

| Script | Komut |
|--------|--------|
| Geliştirme | `npm run dev` |
| Build | `npm run build` |
| Prod sunucu | `npm start` |
| Lint | `npm run lint` |
| Test | `npm test` |
| Test (watch) | `npm run test:watch` |

## Notlar

- Public okumalar `listings_public` view kullanır; `anlasildi` durumunda telefon/e-posta gizlenir.
- Yazma işlemleri service role ile sunucu tarafında yapılır; `listings` tablosuna anon erişim yoktur.
- Malik erişimi `manage_token` ile secret URL üzerinden sağlanır.
