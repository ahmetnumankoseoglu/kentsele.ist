import { Suspense } from "react";

export default function GirisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="p-8 text-sm">Yükleniyor…</div>}>{children}</Suspense>;
}
