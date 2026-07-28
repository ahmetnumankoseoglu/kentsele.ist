import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function NotFound() {
  return (
    <AppShell showBottomCta={false}>
      <div className="card-elevated p-8 text-center">
        <p className="text-sm font-bold text-[#2cb34f]">404</p>
        <h1 className="mt-2 text-xl font-bold text-[#111321]">
          Sayfa bulunamadı
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Aradığın sayfa yok veya kaldırılmış olabilir.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          Ana sayfaya dön
        </Link>
      </div>
    </AppShell>
  );
}
