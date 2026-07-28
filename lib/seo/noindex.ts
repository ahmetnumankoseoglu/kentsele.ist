import type { Metadata } from "next";

/** Hesap / yönetim sayfaları — arama dizinine girmesin */
export const NOINDEX_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};
