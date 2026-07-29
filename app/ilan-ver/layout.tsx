import type { Metadata } from "next";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "Ücretsiz ilan ver",
  description:
    "İstanbul’da malik olarak ücretsiz ilan oluştur. Kısa form, ekip teyidi sonrası liste.",
  path: "/ilan-ver",
  keywords: ["ilan ver", "malik", "ücretsiz ilan"],
});

export default function IlanVerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
