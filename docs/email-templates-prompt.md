# Kentsele e-posta şablonları — tasarım prompt’ları

Bu dosya, görsel e-posta şablonlarını (Figma, Canva, Resend editor, React Email) **kentsele.ist markasına** uygun üretirken kullanılacak direktif ve prompt setidir.

Kodda çalışan HTML iskeleti: `lib/email/layout.ts` + `lib/email/templates.ts`.

---

## Marka sistemi (zorunlu)

| Token | Değer | Kullanım |
|--------|--------|----------|
| Marka adı | `kentsele` + yeşil `.ist` | Logo satırı |
| Koyu zemin | `#111321` | Header şeridi |
| Yeşil primary | `#2cb34f` | CTA buton, vurgu |
| Yeşil koyu | `#168f43` | Link hover / ikincil |
| Metin | `#111321` | Başlık |
| Gövde | `#6b7280` | Paragraf |
| Arka plan | `#f4f5f7` | Mail body bg |
| Kart | `#ffffff` | İçerik kutusu |
| Kenarlık | `#e3e4e6` | İnce border |
| Radius | `3px` | Buton/kart (sitedeki gibi “neredeyse kare”) |
| Font | Arial, Helvetica, sans-serif | E-posta güvenli |
| Dil | Türkçe (sen / siz karıştırmadan **sen** tonu siteyle uyumlu) | — |
| Ürün | İstanbul kentsel dönüşüm ilan panosu; malik ücretsiz ilan; onaylı müteahhit | — |

**Yasak:** stok “corporate blue” temalar, mor gradient SaaS, fake stock photo hero, İngilizce default metin, spam kelimeleri (ACİL!!!, %100 GARANTİ).

**CTA kuralı:** Tek ana buton, yeşil `#2cb34f`, beyaz bold yazı, max 2–4 kelime.

---

## Master prompt (görsel tasarım aracı / AI)

Aşağıdaki bloğu kopyala; `{{TEMPLATE_NAME}}` ve `{{PURPOSE}}` yerlerini doldur.

```
You are designing a transactional email for kentsele.ist (Istanbul urban transformation listing platform).

Brand:
- Name lockup: "kentsele" in white + ".ist" in #2cb34f on dark bar #111321
- Accent green #2cb34f, dark text #111321, muted #6b7280, page bg #f4f5f7, card white, 3px corners
- Mobile-first, max-width ~560px, table-based HTML-friendly layout
- Tone: clear Turkish, respectful, short paragraphs, no marketing fluff
- Tagline under logo: "İstanbul · Kentsel Dönüşüm"

Template: {{TEMPLATE_NAME}}
Purpose: {{PURPOSE}}

Structure:
1. Preheader (hidden, ~80 chars)
2. Dark brand header
3. H1 title
4. Greeting with {{name}}
5. 1–2 short body paragraphs
6. Optional meta box (ilçe, mahalle, kat/daire)
7. Single primary CTA button
8. Footer: © year kentsele.ist · Yalnızca İstanbul · link to site

Deliver:
- Figma/frame description OR clean HTML (inline CSS only)
- Subject line (Turkish, under 55 chars, include context not spam)
- Plain-text alternative outline

Do NOT invent legal claims. Do NOT show phone numbers in email body unless the purpose is contact confirmation for the owner themselves.
```

---

## Şablon envanteri + özel prompt satırları

Her satır: **dosya/kod adı** · konu · `{{PURPOSE}}` için ek cümle.

### Malik / ilan

| ID | Kod fonksiyonu | Subject fikri | PURPOSE eki |
|----|----------------|---------------|-------------|
| L1 | `templateListingReceived` | İlanınız incelemede · {ilçe} | Confirm listing submitted; under review; keep manage link safe |
| L2 | `templateListingPublished` | İlanınız yayında · {ilçe} | Celebrate publish; approved contractors may contact |
| L3 | `templateListingBackToReview` | İlan yeniden incelemede | Owner edited; back to moderation |
| L4 | `templateListingAgreed` | Anlaşma sağlandı · {ilçe} | Status closed for offers |
| L5 | `templateListingRemoved` | İlan kaldırıldı · {ilçe} | Removed from public list; offer new listing |
| L6 | `templateActivateAccount` | Üyeliğini aktifleştir | Same email as listing → register to manage from Hesabım |
| L7 | (ileride) `listingReminderReview` | İlanın hâlâ incelemede | Soft 48h “still reviewing” if needed |

### Hesap

| ID | Kod | PURPOSE eki |
|----|-----|-------------|
| A1 | `templateWelcomeMalik` | Welcome malik; free listing CTA |
| A2 | `templateWelcomeContractor` | Welcome contractor; upload documents |
| A3 | `templateContractorApproved` | Approved; can see owner phones on listings |
| A4 | `templateContractorRejected` | Rejected; show reason; re-upload CTA |
| A5 | Supabase magic | Password reset — style subject only; body can stay Supabase or custom later |

### Operasyon / admin

| ID | Kod | PURPOSE eki |
|----|-----|-------------|
| O1 | `templateAdminNewListing` | Internal: new listing needs moderation |
| O2 | `templateAdminContactNotify` | Internal: contact form message |
| O3 | (ileride) `adminDailyDigest` | Optional digest of pending listings |

---

## Figma / görsel AI için tek şablon prompt örneği (L2 Yayında)

```
Design a 560px wide transactional email for kentsele.ist.

Header: full-width bar #111321, logo "kentsele" white + ".ist" #2cb34f, small green uppercase label "İstanbul · Kentsel Dönüşüm".

Title: "İlanınız yayında"
Body TR: short congratulations; listing is live; approved contractors can contact.
Meta box light gray: İlçe Kadıköy · 5 kat · 8 daire
CTA button #2cb34f white text "İlanı görüntüle" 3px radius
Footer tiny gray copyright + kentsele.ist

Style like a premium Turkish proptech product: calm, green accent, no stock photos, no illustrations required. Export specs for HTML email.
```

---

## Resend dashboard notları

1. **API key:** `.env` → `RESEND_API_KEY=re_...` (asla repo’ya commit etme; `re_xxxxxxxxx` placeholder bırakma).
2. **From:** Domain verify sonrası örn. `Kentsele <bildirim@mail.kentsele.ist>`. Test için geçici `onboarding@resend.dev` + kendi hesabına `to`.
3. **Test:** Admin veya script ile tek alıcı; production’da `ADMIN_NOTIFY_EMAIL` iç bildirim.
4. **Supabase Auth e-postaları** (şifre sıfırlama) ayrı — istersen custom SMTP = Resend SMTP.

---

## Yeni şablon ekleme checklist (dev)

1. `lib/email/templates.ts` içine `templateXxx` ekle (`emailLayout` kullan).
2. `lib/email/send.ts` içinde tetikleyici fonksiyon.
3. İlgili API route’ta `await emailOn...` (hata yutulsun, ana işlem bozulmasın).
4. Bu dosyaya PURPOSE satırı ekle.
5. Subject’te `kentsele.ist` domain spam skoru için abartma; marka kısa “Kentsele” de olabilir.
