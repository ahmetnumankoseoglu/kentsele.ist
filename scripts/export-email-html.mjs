/**
 * Export all email templates as standalone HTML files under docs/email-html/
 * Run: node scripts/export-email-html.mjs
 */

import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "docs", "email-html");

const SITE = "https://kentsele.ist";
const BRAND = {
  bg: "#f4f5f7",
  card: "#ffffff",
  ink: "#111321",
  muted: "#6b7280",
  primary: "#2cb34f",
  primaryDark: "#168f43",
  border: "#e3e4e6",
  footer: "#9ca3af",
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
function p(text) {
  return `<p style="margin:0 0 14px;color:${BRAND.muted};font-size:14px;line-height:1.65;">${text}</p>`;
}
function strong(text) {
  return `<strong style="color:${BRAND.ink};">${escapeHtml(text)}</strong>`;
}
function metaBox(rows) {
  const lines = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.footer};width:40%;">${escapeHtml(r.label)}</td>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.ink};font-weight:600;">${escapeHtml(r.value)}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;background:#f8f8f8;border-radius:3px;border:1px solid ${BRAND.border};">
    <tr><td style="padding:12px 16px;"><table role="presentation" width="100%">${lines}</table></td></tr>
  </table>`;
}

function emailLayout({ preheader, title, bodyHtml, cta, footerNote }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>`
    : "";
  const ctaBlock = cta
    ? `
      <tr>
        <td style="padding:8px 32px 28px;">
          <a href="${escapeAttr(cta.href)}"
             style="display:inline-block;background:${BRAND.primary};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:3px;">
            ${escapeHtml(cta.label)}
          </a>
        </td>
      </tr>`
    : "";
  const footerExtra = footerNote
    ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:${BRAND.footer};">${escapeHtml(footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  ${pre}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.bg};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.card};border-radius:4px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="background:${BRAND.ink};padding:20px 32px;">
              <a href="${SITE}" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;text-decoration:none;">
                kentsele<span style="color:${BRAND.primary};">.ist</span>
              </a>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.primary};">
                İstanbul · Kentsel Dönüşüm
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
              <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${BRAND.ink};font-weight:700;">
                ${escapeHtml(title)}
              </h1>
              <div style="font-size:14px;line-height:1.65;color:${BRAND.muted};">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;">
              ${footerExtra}
              <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND.footer};">
                © ${new Date().getFullYear()} kentsele.ist · Yalnızca İstanbul<br/>
                <a href="${SITE}" style="color:${BRAND.primaryDark};text-decoration:none;">kentsele.ist</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const listing = {
  name: "Ayşe Yılmaz",
  ilce: "Kadıköy",
  mahalle: "Caferağa",
  kat: "5",
  daire: "8",
  manageUrl: `${SITE}/yonet/ornek-token`,
  publicUrl: `${SITE}/ilan/kadikoy-ornek`,
};

function listingMeta(ctx) {
  return metaBox([
    { label: "İlçe", value: ctx.ilce },
    ...(ctx.mahalle ? [{ label: "Mahalle", value: ctx.mahalle }] : []),
    ...(ctx.kat && ctx.daire
      ? [{ label: "Bina", value: `${ctx.kat} kat · ${ctx.daire} daire` }]
      : []),
  ]);
}

const templates = [
  {
    id: "01-listing-received",
    subject: `İlanınız incelemede · ${listing.ilce} · kentsele.ist`,
    title: "İlanınız alındı — incelemede",
    html: emailLayout({
      title: "İlanınız alındı — incelemede",
      preheader: `${listing.ilce} ilanınız ekibimiz tarafından inceleniyor.`,
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "Kentsel dönüşüm ilanınızı aldık. Ekibimiz kısa bir teyit süreci yürütür; onay sonrası ilanınız yayına alınır."
        ),
        listingMeta(listing),
        p(
          "Düzenlemek veya durumunu takip etmek için aşağıdaki yönetim bağlantısını saklayın. Bu linke erişim için ilandaki e-posta ile giriş yapmanız gerekir."
        ),
      ].join(""),
      cta: { label: "İlanımı yönet", href: listing.manageUrl },
      footerNote:
        "Bu e-posta, ilan formunda verdiğiniz adrese otomatik gönderilmiştir.",
    }),
  },
  {
    id: "02-listing-published",
    subject: `İlanınız yayında · ${listing.ilce} · kentsele.ist`,
    title: "İlanınız yayında",
    html: emailLayout({
      title: "İlanınız yayında",
      preheader: `${listing.ilce} ilanınız onaylandı ve yayında.`,
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "Tebrikler — ilanınız onaylandı ve İstanbul kentsel dönüşüm listesinde yayında. Onaylı müteahhitler ilanınızı görebilir ve sizinle iletişime geçebilir."
        ),
        listingMeta(listing),
      ].join(""),
      cta: { label: "İlanı görüntüle", href: listing.publicUrl },
    }),
  },
  {
    id: "03-listing-back-to-review",
    subject: `İlan yeniden incelemede · ${listing.ilce}`,
    title: "İlanınız yeniden incelemede",
    html: emailLayout({
      title: "İlanınız yeniden incelemede",
      preheader: "Yaptığınız güncelleme nedeniyle ilan yeniden incelenecek.",
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "İlanınızda yaptığınız değişiklikler nedeniyle kayıt yeniden inceleme kuyruğuna alındı. Onay sonrası tekrar yayına alınacaktır."
        ),
        listingMeta(listing),
      ].join(""),
      cta: { label: "İlanımı yönet", href: listing.manageUrl },
    }),
  },
  {
    id: "04-listing-agreed",
    subject: `Anlaşma sağlandı · ${listing.ilce}`,
    title: "Anlaşma sağlandı olarak işaretlendi",
    html: emailLayout({
      title: "Anlaşma sağlandı olarak işaretlendi",
      preheader: "İlanınız artık teklife kapalı.",
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "İlanınız “Anlaşma sağlandı” durumuna alındı. İletişim bilgileri müteahhitlere kapalıdır; ilan arşiv görünümünde kalabilir."
        ),
        listingMeta(listing),
      ].join(""),
      cta: { label: "İlanımı yönet", href: listing.manageUrl },
    }),
  },
  {
    id: "05-listing-removed",
    subject: `İlan kaldırıldı · ${listing.ilce}`,
    title: "İlanınız yayından kaldırıldı",
    html: emailLayout({
      title: "İlanınız yayından kaldırıldı",
      preheader: "İlanınız artık listelerde görünmüyor.",
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "İlanınız yayından kaldırıldı. Yeniden yayınlamak isterseniz yönetim panelinden güncelleyebilir veya yeni ilan oluşturabilirsiniz."
        ),
        listingMeta(listing),
      ].join(""),
      cta: { label: "Yeni ilan ver", href: `${SITE}/ilan-ver` },
    }),
  },
  {
    id: "06-activate-account",
    subject: "Üyeliğini aktifleştir · kentsele.ist",
    title: "Hesabını aktifleştir — ilanını kolay yönet",
    html: emailLayout({
      title: "Hesabını aktifleştir — ilanını kolay yönet",
      preheader: "Aynı e-posta ile kayıt ol, ilanlarını tek yerden yönet.",
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          `kentsele.ist’te ilan oluşturdun. <strong style="color:#111321;">ayse@example.com</strong> adresiyle ücretsiz hesap açarsan ilanlarını “Hesabım”dan takip edebilir, düzenleyebilirsin.`
        ),
        p(
          "Önemli: İlan düzenleme yetkisi, ilanda yazdığın e-posta ile giriş yaptığında geçerlidir."
        ),
      ].join(""),
      cta: {
        label: "Ücretsiz kayıt ol",
        href: `${SITE}/kayit?next=${encodeURIComponent(listing.manageUrl)}`,
      },
    }),
  },
  {
    id: "07-welcome-malik",
    subject: "Hoş geldin · kentsele.ist",
    title: "Hoş geldin — malik hesabın hazır",
    html: emailLayout({
      title: "Hoş geldin — malik hesabın hazır",
      preheader: "Ücretsiz ilan ver, onaylı müteahhitlerle buluş.",
      bodyHtml: [
        p(`Merhaba ${strong(listing.name)},`),
        p(
          "kentsele.ist malik hesabın oluşturuldu. İstanbul’da kentsel dönüşüm ilanı vermek ücretsizdir; iletişim yalnızca onaylı müteahhitlere açılır."
        ),
      ].join(""),
      cta: { label: "İlan ver", href: `${SITE}/ilan-ver` },
    }),
  },
  {
    id: "08-welcome-contractor",
    subject: "Müteahhit kaydın alındı · kentsele.ist",
    title: "Müteahhit kaydın alındı",
    html: emailLayout({
      title: "Müteahhit kaydın alındı",
      preheader: "Belge yükle, onay sonrası malik iletişimini gör.",
      bodyHtml: [
        p(`Merhaba ${strong("Mehmet Demir")},`),
        p(
          `${strong("Demir İnşaat")} için müteahhit kaydın oluşturuldu.`
        ),
        p(
          "Vergi levhası ve diğer belgeleri paneline yükle. Onay sonrası yayındaki ilanlarda malik telefonunu görebilirsin."
        ),
      ].join(""),
      cta: { label: "Belge yükle", href: `${SITE}/muteahhit` },
    }),
  },
  {
    id: "09-contractor-approved",
    subject: "Müteahhit hesabın onaylandı · kentsele.ist",
    title: "Hesabın onaylandı — iletişim açık",
    html: emailLayout({
      title: "Hesabın onaylandı — iletişim açık",
      preheader: "Artık malik numaralarını görebilirsin.",
      bodyHtml: [
        p(`Merhaba ${strong("Mehmet Demir")},`),
        p(
          "Belgelerin incelendi ve hesabın onaylandı. Yayındaki kentsel dönüşüm ilanlarında malik iletişim bilgisine erişebilirsin."
        ),
      ].join(""),
      cta: { label: "İlanlara git", href: `${SITE}/ilanlar` },
    }),
  },
  {
    id: "10-contractor-rejected",
    subject: "Müteahhit başvurusu güncellendi · kentsele.ist",
    title: "Belge incelemesi tamamlanamadı",
    html: emailLayout({
      title: "Belge incelemesi tamamlanamadı",
      preheader: "Hesabın onaylanmadı — detayları oku.",
      bodyHtml: [
        p(`Merhaba ${strong("Mehmet Demir")},`),
        p(
          "Müteahhit doğrulama başvurun şu an onaylanmadı. Eksik veya geçersiz belge varsa paneldan yeniden yükleyebilirsin."
        ),
        p(
          `<strong style="color:#111321;">Not:</strong> ${escapeHtml("Vergi levhası okunaklı değil; yeniden yükleyin.")}`
        ),
      ].join(""),
      cta: { label: "Panele git", href: `${SITE}/muteahhit` },
    }),
  },
  {
    id: "11-admin-contact",
    subject: "[İletişim] Destek talebi",
    title: "Yeni iletişim mesajı",
    html: emailLayout({
      title: "Yeni iletişim mesajı",
      preheader: "Destek talebi",
      bodyHtml: [
        metaBox([
          { label: "Ad", value: "Zeynep" },
          { label: "E-posta", value: "zeynep@example.com" },
          { label: "Telefon", value: "0532 000 00 00" },
          { label: "Konu", value: "Destek talebi" },
        ]),
        p(escapeHtml("Merhaba, ilan süreci hakkında bilgi almak istiyorum.")),
      ].join(""),
      cta: { label: "Yönetim paneli", href: `${SITE}/yonetim/iletisim` },
    }),
  },
  {
    id: "12-admin-new-listing",
    subject: `[İlan] ${listing.ilce} · inceleme`,
    title: "Yeni ilan — inceleme bekliyor",
    html: emailLayout({
      title: "Yeni ilan — inceleme bekliyor",
      preheader: `${listing.ilce} · ${listing.name}`,
      bodyHtml: [
        p("Yeni bir kentsel dönüşüm ilanı oluşturuldu."),
        listingMeta(listing),
        metaBox([{ label: "İletişim", value: listing.name }]),
      ].join(""),
      cta: {
        label: "Admin’de aç",
        href: `${SITE}/yonetim/ilanlar/11111111-1111-1111-1111-111111111111`,
      },
    }),
  },
];

mkdirSync(outDir, { recursive: true });

const index = [];
for (const t of templates) {
  const file = `${t.id}.html`;
  writeFileSync(join(outDir, file), t.html, "utf8");
  index.push({ id: t.id, subject: t.subject, title: t.title, file });
  console.log("wrote", file);
}

writeFileSync(
  join(outDir, "index.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), templates: index }, null, 2),
  "utf8"
);

// Single combined HTML for easy browser preview
const combined = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <title>Kentsele e-posta şablonları</title>
  <style>
    body { font-family: Arial, sans-serif; background: #e5e7eb; margin: 0; padding: 24px; }
    h1 { color: #111321; }
    .nav a { display: inline-block; margin: 4px 8px 4px 0; color: #168f43; }
    section { margin: 40px 0; }
    .label { font-size: 12px; font-weight: 700; color: #6b7280; margin-bottom: 8px; }
    iframe { width: 100%; max-width: 600px; height: 720px; border: 1px solid #ccc; background: #fff; }
  </style>
</head>
<body>
  <h1>kentsele.ist e-posta şablonları</h1>
  <p class="nav">${index.map((i) => `<a href="#${i.id}">${i.id}</a>`).join("")}</p>
  ${templates
    .map(
      (t) => `
  <section id="${t.id}">
    <div class="label">${t.id} · ${escapeHtml(t.subject)}</div>
    <iframe srcdoc="${t.html.replace(/"/g, "&quot;")}"></iframe>
  </section>`
    )
    .join("\n")}
</body>
</html>`;

writeFileSync(join(outDir, "ALL-preview.html"), combined, "utf8");
console.log("done →", outDir);
