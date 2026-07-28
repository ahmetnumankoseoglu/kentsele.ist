/**
 * Import + publish all Kentsele emails as Resend Templates.
 *
 * Usage:
 *   set RESEND_API_KEY=re_xxx
 *   node scripts/resend-import-templates.mjs
 *
 * Optional:
 *   EMAIL_FROM="Kentsele <onboarding@resend.dev>"
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

function layout({ preheader, title, bodyHtml, ctaLabel, ctaHrefVar, footerNote }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>`
    : "";
  const cta = ctaLabel
    ? `
      <tr>
        <td style="padding:8px 32px 28px;">
          <a href="{{{${ctaHrefVar}}}}"
             style="display:inline-block;background:${BRAND.primary};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:3px;">
            ${ctaLabel}
          </a>
        </td>
      </tr>`
    : "";
  const foot = footerNote
    ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:${BRAND.footer};">${footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
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
                ${title}
              </h1>
              <div style="font-size:14px;line-height:1.65;color:${BRAND.muted};">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          ${cta}
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;">
              ${foot}
              <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND.footer};">
                © {{{YEAR}}} kentsele.ist · Yalnızca İstanbul<br/>
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

function p(html) {
  return `<p style="margin:0 0 14px;color:${BRAND.muted};font-size:14px;line-height:1.65;">${html}</p>`;
}

function metaBoxRows(rows) {
  // rows: [{label, valueHtml}]
  const lines = rows
    .map(
      (r) => `<tr>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.footer};width:40%;">${r.label}</td>
          <td style="padding:6px 0;font-size:13px;color:${BRAND.ink};font-weight:600;">${r.valueHtml}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;background:#f8f8f8;border-radius:3px;border:1px solid ${BRAND.border};">
    <tr><td style="padding:12px 16px;"><table role="presentation" width="100%">${lines}</table></td></tr>
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
  fallbackValue: fallback,
});

const commonListingVars = [
  str("NAME", "Malik"),
  str("ILCE", "İstanbul"),
  str("MAHALLE", "—"),
  str("BUILDING", "—"),
  str("MANAGE_URL", `${SITE}/hesabim`),
  str("PUBLIC_URL", `${SITE}/ilanlar`),
  str("YEAR", YEAR),
];

const templates = [
  {
    alias: "listing-received",
    name: "Kentsele · İlan alındı (incelemede)",
    subject: "İlanınız incelemede · {{{ILCE}}} · kentsele.ist",
    variables: commonListingVars,
    html: layout({
      title: "İlanınız alındı — incelemede",
      preheader: "{{{ILCE}}} ilanınız ekibimiz tarafından inceleniyor.",
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
    variables: commonListingVars,
    html: layout({
      title: "İlanınız yayında",
      preheader: "{{{ILCE}}} ilanınız onaylandı ve yayında.",
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
    variables: commonListingVars,
    html: layout({
      title: "İlanınız yeniden incelemede",
      preheader: "Yaptığınız güncelleme nedeniyle ilan yeniden incelenecek.",
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
    variables: commonListingVars,
    html: layout({
      title: "Anlaşma sağlandı olarak işaretlendi",
      preheader: "İlanınız artık teklife kapalı.",
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
    variables: [
      ...commonListingVars,
      str("ILAN_VER_URL", `${SITE}/ilan-ver`),
    ],
    html: layout({
      title: "İlanınız yayından kaldırıldı",
      preheader: "İlanınız artık listelerde görünmüyor.",
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
    variables: [
      str("NAME", "Malik"),
      str("USER_EMAIL", "ornek@example.com"),
      str("REGISTER_URL", `${SITE}/kayit`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Hesabını aktifleştir — ilanını kolay yönet",
      preheader: "Aynı e-posta ile kayıt ol, ilanlarını tek yerden yönet.",
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
    variables: [
      str("NAME", "Malik"),
      str("ILAN_VER_URL", `${SITE}/ilan-ver`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Hoş geldin — malik hesabın hazır",
      preheader: "Ücretsiz ilan ver, onaylı müteahhitlerle buluş.",
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
    variables: [
      str("NAME", "Müteahhit"),
      str("COMPANY", "Firma"),
      str("MUTEAHHIT_URL", `${SITE}/muteahhit`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Müteahhit kaydın alındı",
      preheader: "Belge yükle, onay sonrası malik iletişimini gör.",
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
    variables: [
      str("NAME", "Müteahhit"),
      str("ILANLAR_URL", `${SITE}/ilanlar`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Hesabın onaylandı — iletişim açık",
      preheader: "Artık malik numaralarını görebilirsin.",
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
    variables: [
      str("NAME", "Müteahhit"),
      str("REASON", "Belgeleri paneldan yeniden yükleyebilirsin."),
      str("MUTEAHHIT_URL", `${SITE}/muteahhit`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Belge incelemesi tamamlanamadı",
      preheader: "Hesabın onaylanmadı — detayları oku.",
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
    variables: [
      str("CONTACT_NAME", "Ziyaretçi"),
      str("CONTACT_EMAIL", "ornek@example.com"),
      str("PHONE", "—"),
      str("SUBJECT", "Mesaj"),
      str("BODY", ""),
      str("ADMIN_URL", `${SITE}/yonetim/iletisim`),
      str("YEAR", YEAR),
    ],
    html: layout({
      title: "Yeni iletişim mesajı",
      preheader: "{{{SUBJECT}}}",
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
    variables: [
      ...commonListingVars,
      str("LISTING_ADMIN_URL", `${SITE}/yonetim/ilanlar`),
    ],
    html: layout({
      title: "Yeni ilan — inceleme bekliyor",
      preheader: "{{{ILCE}}} · {{{NAME}}}",
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
    try {
      const found = byAlias.get(t.alias);
      if (found) {
        const { data, error } = await resend.templates.update(found.id, {
          name: t.name,
          subject: t.subject,
          html: t.html,
          from: FROM,
          alias: t.alias,
          variables: t.variables,
        });
        if (error) throw new Error(error.message);
        const pub = await resend.templates.publish(found.id);
        if (pub.error) throw new Error(pub.error.message);
        console.log(`updated+published ${found.id}`);
        results.push({
          alias: t.alias,
          id: found.id,
          action: "updated",
          subject: t.subject,
        });
      } else {
        const published = await resend.templates
          .create({
            name: t.name,
            alias: t.alias,
            subject: t.subject,
            from: FROM,
            html: t.html,
            variables: t.variables,
          })
          .publish();
        if (published.error) throw new Error(published.error.message);
        const id = published.data?.id ?? null;
        console.log(`created+published ${id || "?"}`);
        results.push({
          alias: t.alias,
          id,
          action: "created",
          subject: t.subject,
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

  // Refresh IDs from list
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

  const outPath = join(root, "lib", "email", "resend-template-ids.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  mkdirSync(join(root, "docs", "email-html"), { recursive: true });
  writeFileSync(
    join(root, "docs", "email-html", "resend-import-result.json"),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  console.log("\nSaved mapping → lib/email/resend-template-ids.json");
  console.log(JSON.stringify(out.byAlias, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
