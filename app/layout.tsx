import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAdsTag } from "@/components/seo/GoogleAdsTag";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { siteGraphSchema } from "@/lib/seo/schema";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import { getSiteUrl } from "@/lib/seo/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2cb34f" },
    { media: "(prefers-color-scheme: dark)", color: "#111321" },
  ],
  colorScheme: "light",
};

const baseMeta = istanbulGeoMetadata();

export const metadata: Metadata = {
  ...baseMeta,
  title: {
    default: "kentsele.ist | İstanbul Kentsel Dönüşüm İlanları",
    template: "%s | kentsele.ist",
  },
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/icons/icon-192", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  other: {
    ...((baseMeta.other as Record<string, string> | undefined) ?? {}),
    "llms-txt": "/llms.txt",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr-TR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-[#111321]">
        <GoogleAdsTag />
        <JsonLd data={siteGraphSchema()} />
        <PwaRegister />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
