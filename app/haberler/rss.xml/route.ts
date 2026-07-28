import { getAllHaberler } from "@/lib/content/haberler";
import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";

export const dynamic = "force-static";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Google News / RSS uyumlu haber feed */
export async function GET() {
  const site = getSiteUrl();
  const items = getAllHaberler();
  const lastBuild = items[0]?.datePublished ?? new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — İstanbul Kentsel Dönüşüm Haberleri`)}</title>
    <link>${site}/haberler</link>
    <description>${escapeXml("İstanbul kentsel dönüşüm haberleri, rehberler ve piyasa notları.")}</description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${site}/haberler/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map((h) => {
        const link = `${site}/haberler/${h.slug}`;
        const content = h.body.map((p) => `<p>${escapeXml(p)}</p>`).join("");
        return `
    <item>
      <title>${escapeXml(h.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(h.datePublished).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(h.authorName)}</dc:creator>
      <description>${escapeXml(h.description)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <category>Kentsel Dönüşüm</category>
      <category>İstanbul</category>
      ${h.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
