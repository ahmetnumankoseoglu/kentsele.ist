import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/yonet/",
          "/yonetim",
          "/yonetim/",
          "/api/",
          "/giris",
          "/kayit",
          "/hesabim",
          "/muteahhit",
          "/sifremi-unuttum",
          "/sifre-yenile",
        ],
      },
      {
        userAgent: "Googlebot-News",
        allow: ["/haberler", "/haberler/"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
