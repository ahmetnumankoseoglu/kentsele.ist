import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function NotFound() {
  return (
    <AppShell showBottomCta={false}>
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          Sayfa bulunamadı
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Aradığın sayfa yok veya kaldırılmış olabilir. Ana sayfadan ilanlara
          göz atabilirsin.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </AppShell>
  );
}
