import { PRODUCTION_SITE_URL, SITE_NAME } from "@/lib/seo/site";

/** Kentsele brand tokens for email HTML */
export const EMAIL_BRAND = {
  bg: "#f4f5f7",
  card: "#ffffff",
  ink: "#111321",
  muted: "#6b7280",
  primary: "#2cb34f",
  primaryDark: "#168f43",
  border: "#e3e4e6",
  footer: "#9ca3af",
} as const;

export type EmailCta = {
  label: string;
  href: string;
};

/**
 * Shared HTML shell — table-based for Outlook/Gmail compatibility.
 */
export function emailLayout(opts: {
  preheader?: string;
  title: string;
  bodyHtml: string;
  cta?: EmailCta;
  footerNote?: string;
}): string {
  const site = PRODUCTION_SITE_URL;
  const pre = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(opts.preheader)}</div>`
    : "";

  const ctaBlock = opts.cta
    ? `
      <tr>
        <td style="padding:8px 32px 28px;">
          <a href="${escapeAttr(opts.cta.href)}"
             style="display:inline-block;background:${EMAIL_BRAND.primary};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:3px;">
            ${escapeHtml(opts.cta.label)}
          </a>
        </td>
      </tr>`
    : "";

  const footerExtra = opts.footerNote
    ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:${EMAIL_BRAND.footer};">${escapeHtml(opts.footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.bg};">
  ${pre}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${EMAIL_BRAND.bg};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${EMAIL_BRAND.card};border-radius:4px;border:1px solid ${EMAIL_BRAND.border};overflow:hidden;">
          <tr>
            <td style="background:${EMAIL_BRAND.ink};padding:20px 32px;">
              <a href="${site}" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;text-decoration:none;">
                kentsele<span style="color:${EMAIL_BRAND.primary};">.ist</span>
              </a>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL_BRAND.primary};">
                İstanbul · Kentsel Dönüşüm
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
              <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${EMAIL_BRAND.ink};font-weight:700;">
                ${escapeHtml(opts.title)}
              </h1>
              <div style="font-size:14px;line-height:1.65;color:${EMAIL_BRAND.muted};">
                ${opts.bodyHtml}
              </div>
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${EMAIL_BRAND.border};font-family:Arial,Helvetica,sans-serif;">
              ${footerExtra}
              <p style="margin:0;font-size:12px;line-height:1.5;color:${EMAIL_BRAND.footer};">
                © ${new Date().getFullYear()} ${SITE_NAME} · Yalnızca İstanbul<br/>
                <a href="${site}" style="color:${EMAIL_BRAND.primaryDark};text-decoration:none;">${site.replace("https://", "")}</a>
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

export function p(text: string): string {
  return `<p style="margin:0 0 14px;color:${EMAIL_BRAND.muted};font-size:14px;line-height:1.65;">${text}</p>`;
}

export function strong(text: string): string {
  return `<strong style="color:${EMAIL_BRAND.ink};">${escapeHtml(text)}</strong>`;
}

export function metaBox(rows: { label: string; value: string }[]): string {
  const lines = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:6px 0;font-size:13px;color:${EMAIL_BRAND.footer};width:40%;">${escapeHtml(r.label)}</td>
          <td style="padding:6px 0;font-size:13px;color:${EMAIL_BRAND.ink};font-weight:600;">${escapeHtml(r.value)}</td>
        </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;background:#f8f8f8;border-radius:3px;border:1px solid ${EMAIL_BRAND.border};">
    <tr><td style="padding:12px 16px;"><table role="presentation" width="100%">${lines}</table></td></tr>
  </table>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

/** Plain text fallback from simple fields */
export function plainFromLines(lines: string[]): string {
  return lines.filter(Boolean).join("\n\n");
}
