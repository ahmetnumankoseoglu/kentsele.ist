import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/seo/site";

/** Hesap paneli — index edilmez; hreflang yok (çakışma engeli) */
export const metadata: Metadata = {
  title: "Hesabım",
  description:
    "Hesap ve ilan yönetimi paneli. Giriş gerektirir; arama motorlarında listelenmez.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: {
    canonical: `${getSiteUrl()}/hesabim`,
  },
};

export default function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
