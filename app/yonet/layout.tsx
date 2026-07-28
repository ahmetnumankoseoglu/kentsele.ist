import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "İlan yönetimi",
};

export default function YonetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
