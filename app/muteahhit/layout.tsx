import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Müteahhit paneli",
};

export default function MuteahhitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
