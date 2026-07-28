import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
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

export const metadata: Metadata = {
  ...istanbulGeoMetadata(),
  title: {
    default: "İstanbul Kentsel Dönüşüm İlanları | Ücretsiz Malik İlanı",
    template: "%s | Kentsele",
  },
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
        <JsonLd data={siteGraphSchema()} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
