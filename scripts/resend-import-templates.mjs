/**
 * Import + publish all Kentsele emails as Resend Templates.
 *
 * Usage:
 *   set RESEND_API_KEY=re_xxx
 *   node scripts/resend-import-templates.mjs
 *
 * Notes:
 * - YEAR and all variables must be strings when sending.
 * - previewText is embedded as preheader + PREVIEW_TEXT variable (inbox snippet).
 * - HTML is a body fragment (no full document) so Resend visual editor keeps content.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const API_KEY = process.env.RESEND_API_KEY?.trim();
if (!API_KEY || API_KEY.includes("xxxxxxxxx")) {
  console.error("Set RESEND_API_KEY to your real Resend key (not re_xxxxxxxxx).");
  process.exit(1);
}

const FROM =
  process.env.EMAIL_FROM?.trim() || "Kentsele <onboarding@resend.dev>";
const SITE = "https://kentsele.ist";
const YEAR = String(new Date().getFullYear());

const resend = new Resend(API_KEY);

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

/**
 * Resend-friendly HTML fragment:
 * - No <!DOCTYPE>/<html>/<head> (visual editor often treats full docs as empty)
 * - Explicit preheader for inbox preview text
 */
function layout({ title, bodyHtml, ctaLabel, ctaHrefVar, footerNote }) {
  const cta = ctaLabel
    ? `<div style="margin:8px 0 24px;">
        <a href="{{{${ctaHrefVar}}}}" style="display:inline-block;background:${BRAND.primary};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:3px;">
          ${ctaLabel}
        </a>
      </div>`
    : "";

  const footNote = footerNote
    ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:${BRAND.footer};font-family:Arial,Helvetica,sans-serif;">${footerNote}</p>`
    : "";

  return `<!--[if mso]><style type="text/css">body, table, td {font-family: Arial, Helvetica, sans-serif !important;}</style><![endif]-->
<div style="display:none;font-size:1px;color:#f4f5f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
  {{{PREVIEW_TEXT}}}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.bg};margin:0;padding:0;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:4px;">
        <tr>
          <td style="background:${BRAND.ink};padding:20px 28px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;line-height:1.2;">
              kentsele<span style="color:${BRAND.primary};">.ist</span>
            </p>
            <p style="margin:6px 0 0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.primary};">
              İstanbul · Kentsel Dönüşüm
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;">
            <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${BRAND.ink};font-weight:700;">
              ${title}
            </h1>
            <div style="font-size:14px;line-height:1.65;color:${BRAND.muted};">
              ${bodyHtml}
            </div>
            ${cta}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px 28px;border-top:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;">
            ${footNote}
            <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND.footer};">
              © {{{YEAR}}} kentsele.ist · Yalnızca İstanbul<br/>
              <a href="${SITE}" style="color:${BRAND.primaryDark};text-decoration:none;">kentsele.ist</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

function p(html) {
  return `<p style="margin:0 0 14px;color:${BRAND.muted};font-size:14px;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">${html}</p>`;
}

function metaBoxRows(rows) {
  const lines = rows
    .map(
      (r) => `<tr>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.footer};width:40%;font-family:Arial,Helvetica,sans-serif;">${r.label}</td>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.ink};font-weight:600;font-family:Arial,Helvetica,sans-serif;">${r.valueHtml}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;background:#f8f8f8;border-radius:3px;border:1px solid ${BRAND.border};">
    <tr><td style="padding:12px 16px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${lines}</table></td></tr>
  </table>`;
}

const listingMeta = metaBoxRows([
  { label: "İlçe", valueHtml: "{{{ILCE}}}" },
  { label: "Mahalle", valueHtml: "{{{MAHALLE}}}" },
  { label: "Bina", valueHtml: "{{{BUILDING}}}" },
]);

const str = (key, fallback = "") => ({
  key,
  type: "string",
  fallbackValue: String(fallback ?? ""),
});

const commonListingVars = [
  str("PREVIEW_TEXT", "İlanınız hakkında bilgilendirme"),
  str("NAME", "Malik"),
  str("ILCE", "İstanbul"),
  str("MAHALLE", "—"),
  str("BUILDING", "—"),
  str("MANAGE_URL", `${SITE}/hesabim`),
  str("PUBLIC_URL", `${SITE}/ilanlar`),
  str("YEAR", YEAR),
];

function plainText(lines) {
  return lines.filter(Boolean).join("\n\n");
}

const templates = [
  {
    alias: "listing-received",
    name: "Kentsele · İlan alındı (incelemede)",
    subject: "İlanınız incelemede · {{{ILCE}}} · kentsele.ist",
    previewFallback: "İlanınız alındı ve ekibimiz inceliyor.",
    variables: commonListingVars,
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "Kentsel dönüşüm ilanınızı aldık. Ekibimiz kısa bir teyit süreci yürütür; onay sonrası ilanınız yayına alınır.",
      "İlçe: {{{ILCE}}}",
      "Mahalle: {{{MAHALLE}}}",
      "Bina: {{{BUILDING}}}",
      "İlanını yönet: {{{MANAGE_URL}}}",
    ]),
    html: layout({
      title: "İlanınız alındı — incelemede",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "Kentsel dönüşüm ilanınızı aldık. Ekibimiz kısa bir teyit süreci yürütür; onay sonrası ilanınız yayına alınır."
        ),
        listingMeta,
        p(
          "Düzenlemek veya durumunu takip etmek için aşağıdaki yönetim bağlantısını saklayın. Bu linke erişim için ilandaki e-posta ile giriş yapmanız gerekir."
        ),
      ].join(""),
      ctaLabel: "İlanımı yönet",
      ctaHrefVar: "MANAGE_URL",
      footerNote:
        "Bu e-posta, ilan formunda verdiğiniz adrese otomatik gönderilmiştir.",
    }),
  },
  {
    alias: "listing-published",
    name: "Kentsele · İlan yayında",
    subject: "İlanınız yayında · {{{ILCE}}} · kentsele.ist",
    previewFallback: "İlanınız onaylandı ve yayında.",
    variables: commonListingVars,
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "İlanınız onaylandı ve İstanbul kentsel dönüşüm listesinde yayında.",
      "İlanı gör: {{{PUBLIC_URL}}}",
    ]),
    html: layout({
      title: "İlanınız yayında",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "Tebrikler — ilanınız onaylandı ve İstanbul kentsel dönüşüm listesinde yayında. Onaylı müteahhitler ilanınızı görebilir ve sizinle iletişime geçebilir."
        ),
        listingMeta,
      ].join(""),
      ctaLabel: "İlanı görüntüle",
      ctaHrefVar: "PUBLIC_URL",
    }),
  },
  {
    alias: "listing-back-to-review",
    name: "Kentsele · İlan yeniden incelemede",
    subject: "İlan yeniden incelemede · {{{ILCE}}}",
    previewFallback: "Güncellemeniz nedeniyle ilan yeniden incelemede.",
    variables: commonListingVars,
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "İlanınız yeniden inceleme kuyruğuna alındı.",
      "Yönet: {{{MANAGE_URL}}}",
    ]),
    html: layout({
      title: "İlanınız yeniden incelemede",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "İlanınızda yaptığınız değişiklikler nedeniyle kayıt yeniden inceleme kuyruğuna alındı. Onay sonrası tekrar yayına alınacaktır."
        ),
        listingMeta,
      ].join(""),
      ctaLabel: "İlanımı yönet",
      ctaHrefVar: "MANAGE_URL",
    }),
  },
  {
    alias: "listing-agreed",
    name: "Kentsele · Anlaşma sağlandı",
    subject: "Anlaşma sağlandı · {{{ILCE}}}",
    previewFallback: "İlanınız anlaşma sağlandı olarak işaretlendi.",
    variables: commonListingVars,
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "İlanınız Anlaşma sağlandı durumuna alındı.",
    ]),
    html: layout({
      title: "Anlaşma sağlandı olarak işaretlendi",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "İlanınız “Anlaşma sağlandı” durumuna alındı. İletişim bilgileri müteahhitlere kapalıdır; ilan arşiv görünümünde kalabilir."
        ),
        listingMeta,
      ].join(""),
      ctaLabel: "İlanımı yönet",
      ctaHrefVar: "MANAGE_URL",
    }),
  },
  {
    alias: "listing-removed",
    name: "Kentsele · İlan kaldırıldı",
    subject: "İlan kaldırıldı · {{{ILCE}}}",
    previewFallback: "İlanınız yayından kaldırıldı.",
    variables: [
      ...commonListingVars,
      str("ILAN_VER_URL", `${SITE}/ilan-ver`),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "İlanınız yayından kaldırıldı.",
      "Yeni ilan: {{{ILAN_VER_URL}}}",
    ]),
    html: layout({
      title: "İlanınız yayından kaldırıldı",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "İlanınız yayından kaldırıldı. Yeniden yayınlamak isterseniz yönetim panelinden güncelleyebilir veya yeni ilan oluşturabilirsiniz."
        ),
        listingMeta,
      ].join(""),
      ctaLabel: "Yeni ilan ver",
      ctaHrefVar: "ILAN_VER_URL",
    }),
  },
  {
    alias: "activate-account",
    name: "Kentsele · Üyelik aktifleştir",
    subject: "Üyeliğini aktifleştir · kentsele.ist",
    previewFallback: "Aynı e-posta ile kayıt ol, ilanını kolay yönet.",
    variables: [
      str("PREVIEW_TEXT", "Aynı e-posta ile kayıt ol, ilanını kolay yönet."),
      str("NAME", "Malik"),
      str("USER_EMAIL", "ornek@example.com"),
      str("REGISTER_URL", `${SITE}/kayit`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "{{{USER_EMAIL}}} adresiyle ücretsiz hesap aç.",
      "Kayıt: {{{REGISTER_URL}}}",
    ]),
    html: layout({
      title: "Hesabını aktifleştir — ilanını kolay yönet",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          `kentsele.ist’te ilan oluşturdun. <strong style="color:${BRAND.ink};">{{{USER_EMAIL}}}</strong> adresiyle ücretsiz hesap açarsan ilanlarını “Hesabım”dan takip edebilir, düzenleyebilirsin.`
        ),
        p(
          "Önemli: İlan düzenleme yetkisi, ilanda yazdığın e-posta ile giriş yaptığında geçerlidir."
        ),
      ].join(""),
      ctaLabel: "Ücretsiz kayıt ol",
      ctaHrefVar: "REGISTER_URL",
    }),
  },
  {
    alias: "welcome-malik",
    name: "Kentsele · Hoş geldin malik",
    subject: "Hoş geldin · kentsele.ist",
    previewFallback: "Malik hesabın hazır — ücretsiz ilan ver.",
    variables: [
      str("PREVIEW_TEXT", "Malik hesabın hazır — ücretsiz ilan ver."),
      str("NAME", "Malik"),
      str("ILAN_VER_URL", `${SITE}/ilan-ver`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "Malik hesabın oluşturuldu.",
      "İlan ver: {{{ILAN_VER_URL}}}",
    ]),
    html: layout({
      title: "Hoş geldin — malik hesabın hazır",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "kentsele.ist malik hesabın oluşturuldu. İstanbul’da kentsel dönüşüm ilanı vermek ücretsizdir; iletişim yalnızca onaylı müteahhitlere açılır."
        ),
      ].join(""),
      ctaLabel: "İlan ver",
      ctaHrefVar: "ILAN_VER_URL",
    }),
  },
  {
    alias: "welcome-contractor",
    name: "Kentsele · Müteahhit kaydı",
    subject: "Müteahhit kaydın alındı · kentsele.ist",
    previewFallback: "Belge yükle, onay sonrası iletişime geç.",
    variables: [
      str("PREVIEW_TEXT", "Belge yükle, onay sonrası iletişime geç."),
      str("NAME", "Müteahhit"),
      str("COMPANY", "Firma"),
      str("MUTEAHHIT_URL", `${SITE}/muteahhit`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "{{{COMPANY}}} için müteahhit kaydın oluşturuldu.",
      "Panel: {{{MUTEAHHIT_URL}}}",
    ]),
    html: layout({
      title: "Müteahhit kaydın alındı",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          `<strong style="color:${BRAND.ink};">{{{COMPANY}}}</strong> için müteahhit kaydın oluşturuldu.`
        ),
        p(
          "Vergi levhası ve diğer belgeleri paneline yükle. Onay sonrası yayındaki ilanlarda malik telefonunu görebilirsin."
        ),
      ].join(""),
      ctaLabel: "Belge yükle",
      ctaHrefVar: "MUTEAHHIT_URL",
    }),
  },
  {
    alias: "contractor-approved",
    name: "Kentsele · Müteahhit onaylandı",
    subject: "Müteahhit hesabın onaylandı · kentsele.ist",
    previewFallback: "Hesabın onaylandı — malik iletişimleri açık.",
    variables: [
      str("PREVIEW_TEXT", "Hesabın onaylandı — malik iletişimleri açık."),
      str("NAME", "Müteahhit"),
      str("ILANLAR_URL", `${SITE}/ilanlar`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "Hesabın onaylandı.",
      "İlanlar: {{{ILANLAR_URL}}}",
    ]),
    html: layout({
      title: "Hesabın onaylandı — iletişim açık",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "Belgelerin incelendi ve hesabın onaylandı. Yayındaki kentsel dönüşüm ilanlarında malik iletişim bilgisine erişebilirsin."
        ),
      ].join(""),
      ctaLabel: "İlanlara git",
      ctaHrefVar: "ILANLAR_URL",
    }),
  },
  {
    alias: "contractor-rejected",
    name: "Kentsele · Müteahhit red",
    subject: "Müteahhit başvurusu güncellendi · kentsele.ist",
    previewFallback: "Başvurun onaylanmadı — detaylara bak.",
    variables: [
      str("PREVIEW_TEXT", "Başvurun onaylanmadı — detaylara bak."),
      str("NAME", "Müteahhit"),
      str("REASON", "Belgeleri paneldan yeniden yükleyebilirsin."),
      str("MUTEAHHIT_URL", `${SITE}/muteahhit`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Merhaba {{{NAME}}},",
      "Başvurun onaylanmadı.",
      "Not: {{{REASON}}}",
      "Panel: {{{MUTEAHHIT_URL}}}",
    ]),
    html: layout({
      title: "Belge incelemesi tamamlanamadı",
      bodyHtml: [
        p(`Merhaba <strong style="color:${BRAND.ink};">{{{NAME}}}</strong>,`),
        p(
          "Müteahhit doğrulama başvurun şu an onaylanmadı. Eksik veya geçersiz belge varsa paneldan yeniden yükleyebilirsin."
        ),
        p(
          `<strong style="color:${BRAND.ink};">Not:</strong> {{{REASON}}}`
        ),
      ].join(""),
      ctaLabel: "Panele git",
      ctaHrefVar: "MUTEAHHIT_URL",
    }),
  },
  {
    alias: "admin-contact",
    name: "Kentsele · Admin iletişim bildirimi",
    subject: "[İletişim] {{{SUBJECT}}}",
    previewFallback: "Yeni iletişim formu mesajı.",
    variables: [
      str("PREVIEW_TEXT", "Yeni iletişim formu mesajı."),
      str("CONTACT_NAME", "Ziyaretçi"),
      str("CONTACT_EMAIL", "ornek@example.com"),
      str("PHONE", "—"),
      str("SUBJECT", "Mesaj"),
      str("BODY", "—"),
      str("ADMIN_URL", `${SITE}/yonetim/iletisim`),
      str("YEAR", YEAR),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Ad: {{{CONTACT_NAME}}}",
      "E-posta: {{{CONTACT_EMAIL}}}",
      "Telefon: {{{PHONE}}}",
      "Konu: {{{SUBJECT}}}",
      "{{{BODY}}}",
    ]),
    html: layout({
      title: "Yeni iletişim mesajı",
      bodyHtml: [
        metaBoxRows([
          { label: "Ad", valueHtml: "{{{CONTACT_NAME}}}" },
          { label: "E-posta", valueHtml: "{{{CONTACT_EMAIL}}}" },
          { label: "Telefon", valueHtml: "{{{PHONE}}}" },
          { label: "Konu", valueHtml: "{{{SUBJECT}}}" },
        ]),
        p("{{{BODY}}}"),
      ].join(""),
      ctaLabel: "Yönetim paneli",
      ctaHrefVar: "ADMIN_URL",
    }),
  },
  {
    alias: "admin-new-listing",
    name: "Kentsele · Admin yeni ilan",
    subject: "[İlan] {{{ILCE}}} · inceleme",
    previewFallback: "Yeni ilan inceleme bekliyor.",
    variables: [
      ...commonListingVars,
      str("LISTING_ADMIN_URL", `${SITE}/yonetim/ilanlar`),
    ],
    text: plainText([
      "{{{PREVIEW_TEXT}}}",
      "Yeni ilan: {{{ILCE}}} · {{{NAME}}}",
      "Admin: {{{LISTING_ADMIN_URL}}}",
    ]),
    html: layout({
      title: "Yeni ilan — inceleme bekliyor",
      bodyHtml: [
        p("Yeni bir kentsel dönüşüm ilanı oluşturuldu."),
        listingMeta,
        metaBoxRows([{ label: "İletişim", valueHtml: "{{{NAME}}}" }]),
      ].join(""),
      ctaLabel: "Admin’de aç",
      ctaHrefVar: "LISTING_ADMIN_URL",
    }),
  },
];

// Ensure PREVIEW_TEXT default matches each template's previewFallback
for (const t of templates) {
  const pv = t.variables.find((v) => v.key === "PREVIEW_TEXT");
  if (pv) pv.fallbackValue = t.previewFallback;
  else
    t.variables.unshift(
      str("PREVIEW_TEXT", t.previewFallback || "kentsele.ist bilgilendirme")
    );
}

async function listAll() {
  const all = [];
  let after;
  for (let i = 0; i < 20; i++) {
    const { data, error } = await resend.templates.list(
      after ? { after, limit: 100 } : { limit: 100 }
    );
    if (error) throw new Error(error.message);
    all.push(...(data?.data || []));
    if (!data?.has_more) break;
    after = data.data[data.data.length - 1]?.id;
  }
  return all;
}

async function main() {
  console.log("Listing existing Resend templates…");
  let existing = [];
  try {
    existing = await listAll();
  } catch (e) {
    console.warn("list failed (continuing create):", e.message);
  }
  const byAlias = new Map(
    existing.filter((t) => t.alias).map((t) => [t.alias, t])
  );

  const results = [];

  for (const t of templates) {
    process.stdout.write(`→ ${t.alias} … `);
    // Guard: html and text must never be empty
    if (!t.html?.trim() || !t.text?.trim()) {
      console.log("SKIP empty content in script definition");
      results.push({ alias: t.alias, action: "skipped_empty_def" });
      continue;
    }

    const payload = {
      name: t.name,
      alias: t.alias,
      subject: t.subject,
      from: FROM,
      html: t.html,
      text: t.text,
      variables: t.variables,
    };

    try {
      const found = byAlias.get(t.alias);
      if (found) {
        const { error } = await resend.templates.update(found.id, payload);
        if (error) throw new Error(error.message);
        const pub = await resend.templates.publish(found.id);
        if (pub.error) throw new Error(pub.error.message);

        // verify
        const { data: got } = await resend.templates.get(found.id);
        const ok =
          got?.html &&
          got.html.length > 100 &&
          got.html.includes("kentsele") &&
          got.text &&
          got.text.length > 20;
        console.log(
          `updated+published ${found.id} html=${got?.html?.length || 0} text=${got?.text?.length || 0} ${ok ? "OK" : "WARN"}`
        );
        results.push({
          alias: t.alias,
          id: found.id,
          action: "updated",
          subject: t.subject,
          htmlLen: got?.html?.length || 0,
          textLen: got?.text?.length || 0,
          ok,
        });
      } else {
        const published = await resend.templates.create(payload).publish();
        if (published.error) throw new Error(published.error.message);
        const id = published.data?.id ?? null;
        let htmlLen = 0;
        let textLen = 0;
        if (id) {
          const { data: got } = await resend.templates.get(id);
          htmlLen = got?.html?.length || 0;
          textLen = got?.text?.length || 0;
        }
        console.log(
          `created+published ${id || "?"} html=${htmlLen} text=${textLen}`
        );
        results.push({
          alias: t.alias,
          id,
          action: "created",
          subject: t.subject,
          htmlLen,
          textLen,
          ok: htmlLen > 100,
        });
      }
    } catch (e) {
      console.log("ERROR", e.message || e);
      results.push({
        alias: t.alias,
        error: e.message || String(e),
        action: "failed",
      });
    }
  }

  try {
    const listed = await listAll();
    for (const r of results) {
      if (r.alias) {
        const hit = listed.find((x) => x.alias === r.alias);
        if (hit) r.id = hit.id;
      }
    }
  } catch {
    /* ignore */
  }

  const out = {
    importedAt: new Date().toISOString(),
    from: FROM,
    templates: results,
    byAlias: Object.fromEntries(
      results.filter((r) => r.id).map((r) => [r.alias, r.id])
    ),
  };

  writeFileSync(
    join(root, "lib", "email", "resend-template-ids.json"),
    JSON.stringify(out, null, 2),
    "utf8"
  );
  mkdirSync(join(root, "docs", "email-html"), { recursive: true });
  writeFileSync(
    join(root, "docs", "email-html", "resend-import-result.json"),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  console.log("\nSaved mapping → lib/email/resend-template-ids.json");
  console.log(JSON.stringify(out.byAlias, null, 2));
  const bad = results.filter((r) => r.action === "failed" || r.ok === false);
  if (bad.length) {
    console.error("\nSome templates need attention:", bad);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
