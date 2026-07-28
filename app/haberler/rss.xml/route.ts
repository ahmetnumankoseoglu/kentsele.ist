import { getPublishedNews } from "@/lib/news/queries";
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

export async function GET() {
  const site = getSiteUrl();
  const items = await getPublishedNews();
  const lastBuild =
    items[0]?.published_at || items[0]?.created_at || new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
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
        const paras = h.body
          .split(/\n\n+/)
          .map((p) => `<p>${escapeXml(p)}</p>`)
          .join("");
        return `
    <item>
      <title>${escapeXml(h.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(h.published_at || h.created_at).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(h.author_name)}</dc:creator>
      <description>${escapeXml(h.description)}</description>
      <content:encoded><![CDATA[${paras}]]></content:encoded>
      <category>Kentsel Dönüşüm</category>
      <category>İstanbul</category>
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
