import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Yönetim",
};

export default function YonetimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
