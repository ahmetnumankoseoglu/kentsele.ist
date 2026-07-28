import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraphSchema } from "@/lib/seo/schema";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...istanbulGeoMetadata(),
  title: {
    default: "kentsele.ist — İstanbul Kentsel Dönüşüm İlanları",
    template: "%s · kentsele.ist",
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
      </body>
    </html>
  );
}
