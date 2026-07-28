# kentsele.ist — Tasarım Belgesi

**Tarih:** 2026-07-28  
**Ürün:** İstanbul kentsel dönüşüm ilan platformu  
**Referans UX:** Armut kentsel dönüşüm talep akışı (sadeleştirilmiş)  
**Stack:** Next.js (App Router) + Supabase (Postgres, RLS)  
**Hosting hedefi:** Vercel Hobby + Supabase Free (SMS yok; aylık maliyet ~0, domain hariç)

---

## 1. Problem ve hedef

İstanbul’da kentsel dönüşüm için malikler müteahhit bulmakta zorlanıyor; dağınık iletişim ve güvensiz kanallar var. **kentsele.ist**, maliklerin bina/proje ilanı oluşturduğu, müteahhitlerin üyeliksiz görüp aradığı, adminin teyit ettiği sade bir ilan panosu sunar.

**Başarı kriterleri (MVP)**
- Ana sayfada onaylı ilanlar listelenir (ilçe filtresi).
- Armut benzeri adım adım form ile ilan talebi oluşturulur.
- Admin teyit araması sonrası yayınlar.
- Yayında telefon/WhatsApp herkese açık.
- “Anlaşıldı” sonrası ilan kalır, numara kapanır.
- Malik üyeliksiz gizli link ile ilanını görür, düzenler, anlaşma bildirir.
- UI profesyonel, temiz; mobilde app hissi (PWA-benzeri layout).

**Kapsam dışı (MVP)**
- Müteahhit kaydı / teklif paneli
- SMS OTP
- Ödeme, garanti, mesajlaşma
- İstanbul dışı iller / ilçeler (ürün yalnızca İstanbul)
- Görsel yükleme / Supabase Storage

### Coğrafi kapsam (kilitli)

- Ürün **yalnızca İstanbul** içindir. İl seçimi yoktur; form ve filtrede sadece ilçe vardır.
- Tüm **39 ilçe** sabit listede yer alır (alfabetik). Kodda tek kaynak: `lib/constants/istanbul-ilceler.ts` (veya eşdeğeri).

**İstanbul ilçeleri (39):**  
Adalar, Arnavutköy, Ataşehir, Avcılar, Bağcılar, Bahçelievler, Bakırköy, Başakşehir, Bayrampaşa, Beşiktaş, Beykoz, Beylikdüzü, Beyoğlu, Büyükçekmece, Çatalca, Çekmeköy, Esenler, Esenyurt, Eyüpsultan, Fatih, Gaziosmanpaşa, Güngören, Kadıköy, Kağıthane, Kartal, Küçükçekmece, Maltepe, Pendik, Sancaktepe, Sarıyer, Silivri, Sultanbeyli, Sultangazi, Şile, Şişli, Tuzla, Ümraniye, Üsküdar, Zeytinburnu

- `ilce` alanı bu listedeki tam adla kaydedilir (serbest metin ilçe yok).
- Slug’da ilçe ASCII formuna çevrilir (ör. `Kadıköy` → `kadikoy`, `Eyüpsultan` → `eyupsultan`, `Kağıthane` → `kagithane`).
- Ana sayfa filtresi: “Tümü” + 39 ilçe (mobilde searchable select veya chip scroll).

---

## 2. Kullanıcı rolleri

| Rol | Yetki |
|-----|--------|
| **Ziyaretçi / müteahhit** | İlan listesi ve detay; Ara / WhatsApp (numara açıksa) |
| **Malik** | Form ile ilan oluşturma; `manage_token` linki ile görüntüleme, düzenleme, “Anlaşma sağlandı” bildirimi |
| **Admin** | İnceleme, yayınlama, durum değiştirme, düzenleme, kaldırma; anlaşma taleplerini onaylama |

---

## 3. URL yapısı (Türkçe slug’lar)

Tüm kullanıcıya dönük path’ler Türkçe ve okunabilir olur. Token’lar opaktır.

| Path | Açıklama |
|------|----------|
| `/` | Ana sayfa — ilan akışı, hero CTA |
| `/ilan-ver` | Adım adım ilan oluşturma sihirbazı |
| `/ilanlar` | Tüm yayındaki ilanlar (filtreli liste; `/` ile aynı veri, opsiyonel ayrı sayfa veya `/` yeter) |
| `/ilan/[slug]` | İlan detayı — slug Türkçe, SEO dostu |
| `/yonet/[token]` | Malik yönetim paneli (gizli token) |
| `/yonetim` | Admin girişi + panel |
| `/yonetim/ilanlar` | Admin ilan listesi |
| `/yonetim/ilanlar/[id]` | Admin ilan detay / düzenle |

### İlan slug kuralları

- Format: `{ilce}-{kisa-ozet}-{kisa-id}`  
  Örnekler:
  - `kadikoy-5-kat-12-daire-a3f2`
  - `besiktas-kat-karsiligi-8-kat-b91c`
  - `fatih-6-daire-hakedis-c4e1`
- Karakterler: küçük harf ASCII (`ç→c`, `ğ→g`, `ı→i`, `ö→o`, `ş→s`, `ü→u`), tire ile ayrılmış.
- Son segment: çakışmayı önleyen 4 karakterlik kısa id (slug unique).
- Yayınlanmadan önce de slug atanır; admin düzenlemede slug sabit kalabilir (SEO bozulmasın) veya nadiren yeniden üretilir.
- `token` (yönetim): `crypto.randomBytes(24).toString('base64url')` — tahmin edilemez; URL’de slug değil.

**Not:** `/ilanlar` MVP’de ana sayfa listesi ile birleştirilebilir; tercih: liste **`/`** üzerinde, “Tüm ilanlar” gerekirse `/ilanlar` alias.

---

## 4. Ürün akışları

### 4.1 İlan oluşturma (malik)

1. `/ilan-ver` sihirbazı (ilerleme çubuğu, tek soru/ekran veya gruplu adımlar).
2. Adımlar:
   1. **İlçe** (39 İstanbul ilçesinden biri; zorunlu) + mahalle (opsiyonel serbest metin)
   2. **Kat sayısı** — “Kentsel dönüşümle kaç kat inşa edilecek? (zemin altı dahil)”  
      Seçenekler: `1` … `7`, `8+`
   3. **Daire sayısı** — “Binada kaç daire olacak?”  
      Seçenekler: `1`…`49` gruplu veya chip’ler + `50+`
   4. **Ödeme tercihi:** `kat_karsiligi` | `hakedis` | `pesin` | `diger` | `belirsiz`
   5. **İhtiyaç detayı** (serbest metin, min/max karakter)
   6. **İletişim:** ad soyad, telefon (TR), e-posta (opsiyonel)
3. Gönder → kayıt `status = incelemede`, `manage_token` üretilir.
4. Başarı ekranı:
   - “İlanın incelenecek; teyit için aranabilirsin.”
   - Yönetim linki + **Kopyala** (`/yonet/{token}`)
   - E-posta varsa aynı link e-posta ile de (Supabase Edge Function veya Resend free; yoksa sadece ekran).

### 4.2 Admin teyit ve yayın

1. Admin `/yonetim` ile girer.
2. **Bekleyen** ilanlar (`incelemede`) ve **anlaşma talepleri** (`agreement_requested_at IS NOT NULL` ve status henüz `anlasildi` değil) badge ile görünür.
3. Admin telefonla teyit eder → **Yayınla** (`yayinda`, `published_at`).
4. İsteğe bağlı durum: **Teklif sağlanıyor** (`teklif_saglaniyor`).
5. **Anlaşıldı** (`anlasildi`): listede kalır; public API telefon/e-posta döndürmez.
6. **Kaldır** (`kaldirildi`): listede ve detayda görünmez (404 veya “kaldırıldı”).

### 4.3 Malik yönetim linki (`/yonet/[token]`)

**Görebilir**
- Güncel durum (Türkçe etiket)
- İlan özeti ve düzenleme formu (konum, kat, daire, ödeme, açıklama, iletişim)
- “Anlaşma sağlandı” bildir butonu (status’u değiştirmez)

**Yapamaz**
- Direkt `yayinda` / `anlasildi` atamak
- Numarayı public’te aç/kapa (sadece admin `anlasildi` ile kapatır)

**Anlaşma bildirimi**
- `agreement_requested_at = now()`
- Admin panelinde bildirim/badge
- Admin onaylayınca → `anlasildi` (+ telefon public’te maskelenir)

**Link kaybı (MVP sade)**
- “Linkimi unuttum”: telefon gir → admin’e manuel veya basit rate-limit’li “yeni link talebi” kaydı; **otomatik SMS yok**.  
  Alternatif MVP: sadece “destek@ / WhatsApp admin” metni. İlk sürümde: başarı ekranında net uyarı + e-posta ile link (e-posta verildiyse).

### 4.4 Public liste ve detay

- Sadece `yayinda`, `teklif_saglaniyor`, `anlasildi` listelenir.
- Kart: ilçe, kat, daire, ödeme etiketi, durum rozeti, kısa açıklama, tarih.
- Detay: tam açıklama; `anlasildi` değilse **Ara** (`tel:`) ve **WhatsApp** (`https://wa.me/90...`) butonları.
- `anlasildi`: “Bu ilan için anlaşma sağlandı” + iletişim yok.

### 4.5 Müteahhit

Üyelik yok. Listeyi gezer, uygun ilanı arar / WhatsApp’lar.

---

## 5. Durum makinesi

```
incelemede
    │ admin yayınla
    ▼
yayinda ◄──► teklif_saglaniyor   (admin geçişleri)
    │
    │ admin anlaşıldı
    ▼
anlasildi   (telefon public kapalı; kayıt silinmez)

her durumdan ──admin──► kaldirildi
```

| Status | Public listede | Public telefon | Malik düzenleme |
|--------|----------------|----------------|-----------------|
| `incelemede` | Hayır | Hayır | Evet |
| `yayinda` | Evet | Evet | Evet |
| `teklif_saglaniyor` | Evet | Evet | Evet |
| `anlasildi` | Evet (rozet) | **Hayır** | Evet (metin); telefon alanı admin politikasına göre kilitlenebilir |
| `kaldirildi` | Hayır | Hayır | Salt okunur önerilir |

Türkçe etiketler:
- İncelemede
- Yayında
- Teklif sağlanıyor
- Anlaşıldı
- Kaldırıldı

---

## 6. Veri modeli (Supabase / Postgres)

### `listings`

| Kolon | Tip | Not |
|-------|-----|-----|
| `id` | uuid PK | `gen_random_uuid()` |
| `slug` | text unique | Türkçe ASCII slug |
| `ilce` | text | İstanbul ilçesi |
| `mahalle` | text null | |
| `kat_sayisi` | text | örn. `5`, `8+` |
| `daire_sayisi` | text | örn. `12`, `50+` |
| `odeme_tercihi` | text | enum-benzeri check |
| `aciklama` | text | |
| `iletisim_adi` | text | |
| `telefon` | text | E.164 veya TR normalize |
| `email` | text null | |
| `status` | text | check constraint |
| `manage_token` | text unique | secret |
| `agreement_requested_at` | timestamptz null | |
| `published_at` | timestamptz null | |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | |

İndeksler: `status`, `ilce`, `created_at desc`, `agreement_requested_at` (partial where not null).

### Admin kimlik

MVP seçenek (basit, maliyetsiz):
- **Ortam değişkeni** `ADMIN_PASSWORD` + HTTP-only cookie session (Next.js route handlers).
- İleride: Supabase Auth tek admin kullanıcı.

RLS ile admin şifresi Postgres’e yazılmaz; admin işlemleri **service role** veya **sunucu tarafı** Supabase client ile yapılır.

---

## 7. Güvenlik ve RLS

**Public (anon)**
- `SELECT` yalnızca public status’larda.
- Kolon maskeleme: `anlasildi` iken `telefon` / `email` client’a gitmez → **view** veya API route ile filtre:
  - Tercih: Next.js Server Components / Route Handlers service veya güvenli view `listings_public` (telefon conditional null).

**Malik**
- Token bilinmeden erişim yok.
- `GET/PATCH` via server: `WHERE manage_token = $token`.
- Token URL’de; HTTPS zorunlu. Token regenerate admin veya “link yenile” ile (v2).

**Admin**
- Tüm yazma işlemleri sunucuda, session doğrulaması sonrası service role.

**Abuse**
- Form rate limit (IP + telefon): basit in-memory/Vercel KV yoksa → Supabase’te son N dakika sayımı veya Upstash free; MVP’de en az honeypot + min süre.
- Token brute-force: uzun entropy.

---

## 8. UI / UX yönü

**Ton:** Profesyonel, sakin, güven veren; inşaat/kentsel dönüşüm ciddiyeti. Armut’un sihirbaz netliği; marketplace karmaşası yok.

**Mobil app hissi**
- Max width, safe-area, sticky alt CTA (“İlan ver”)
- Büyük dokunma alanları, bottom-friendly birincil butonlar
- Wizard tam ekran adımlar, geri oku
- Sistem font stack veya tek kaliteli TR-destekli font (maliyet yok: `next/font` Google — örn. distinctive ama okunaklı bir çift; generic Inter kaçınılabilir)
- PWA manifest (opsiyonel MVP+): home screen ikonu

**Ana sayfa**
- Kısa hero: “İstanbul kentsel dönüşüm ilanları”
- CTA: İlan ver
- Filtre: ilçe
- Kart grid / liste

**Görsel dil**
- Temiz beyaz/açık zemin veya koyu navy vurgu (tek accent)
- Durum rozetleri net renk kodu (anlaşıldı = nötr gri/yeşil)
- Mor gradient “AI slop” yok

---

## 9. Teknik mimari

```
Next.js App Router (TypeScript)
  ├── app/(public)/          # /, /ilan-ver, /ilan/[slug], /ilanlar
  ├── app/yonet/[token]/     # malik
  ├── app/yonetim/           # admin
  ├── app/api/               # form submit, admin actions, public-safe reads if needed
  ├── lib/supabase/          # server + browser clients
  └── lib/slug.ts            # TR transliteration + unique slug

Supabase
  ├── Postgres listings
  ├── RLS + listings_public view (önerilir)
  └── (opsiyonel) Database Webhook → admin e-posta
```

**Env**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (sadece server)
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

---

## 10. Hata ve kenar durumlar

| Durum | Davranış |
|-------|----------|
| Geçersiz token | 404, genel mesaj |
| `kaldirildi` detay | 404 |
| `incelemede` public URL | 404 (slug sızsa bile) |
| Çift submit | Idempotency veya disable buton |
| Anlaşma tekrar bildir | `agreement_requested_at` güncellenir; admin zaten görür |
| Admin şifre yanlış | 401, rate limit |

---

## 11. Test stratejisi (MVP)

- Unit: slug üretimi (TR karakterler), telefon normalize, status geçiş kuralları
- Integration: form → incelemede; admin yayın → public’te görünür; anlaşıldı → telefon yok
- Manuel: mobil genişlik wizard, WhatsApp deep link

---

## 12. Uygulama fazları

**Faz 1 — İskelet**
- Next.js + Supabase şema, seed ilçeler
- Public liste + detay (mock/seed data)

**Faz 2 — Form + malik**
- `/ilan-ver` wizard
- `/yonet/[token]` düzenle + anlaşma bildir

**Faz 3 — Admin**
- `/yonetim` login, onay, durum, anlaşma talepleri

**Faz 4 — Cilâ**
- Filtreler, empty states, mobil polish, SEO metadata (Türkçe title/description)

---

## 13. Açık kararlar (kilitli)

| Konu | Karar |
|------|--------|
| Model | C hibrit: ilan listesi + talep formu |
| İlan sahibi | Sadece malik |
| Müteahhit | Üyeliksiz; ara / WhatsApp |
| Yayın | Admin teyidi sonrası |
| Numara | Public A; anlaşıldı’da kapalı |
| Malik panel | Gizli `/yonet/[token]`; status değiştiremez |
| Anlaşma | Malik bildirir → admin onaylar |
| Stack | Next.js + Supabase |
| Coğrafya | Yalnızca İstanbul; 39 ilçenin tamamı |
| Slug | Türkçe/okunabilir path + ASCII ilan slug |
| Maliyet | Free tier; SMS yok |

---

## 14. Bilinçli basitleştirmeler

- E-posta ile yönetim linki: “varsa gönder”, yoksa sadece UI.
- Link unutma: tam self-serve OTP sonra; MVP’de e-posta + uyarı.
- Admin = şifre cookie, Supabase Auth değil.
- Tek tablo `listings` yeter.
