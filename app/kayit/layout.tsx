import type { Metadata } from "next";
import { Suspense } from "react";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Kayıt ol",
};

export default function KayitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
