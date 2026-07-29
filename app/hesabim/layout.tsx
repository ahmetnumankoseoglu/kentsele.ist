import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = {
  ...istanbulGeoMetadata({
    title: "Hesabım",
    description: "Hesap ve ilan yönetimi paneli.",
    path: "/hesabim",
    noIndex: true,
  }),
  ...NOINDEX_METADATA,
};

export default function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
