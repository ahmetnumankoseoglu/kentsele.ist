import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Hesabım",
};

export default function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
