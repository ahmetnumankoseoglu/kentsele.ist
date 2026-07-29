import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function BasariliPage() {
  return (
    <AppShell showBottomCta={false}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8ee] text-2xl text-[#2cb34f]">
        ✓
      </div>
      <h1 className="mt-4 text-[22px] font-bold text-[#111321]">
        İlanın alındı
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        İnceleme sonrası teyit için aranabilirsin. Yayınlanınca listede görünür.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
        İlanı düzenlemek veya durumunu takip etmek için, ilanda yazdığın{" "}
        <strong className="font-semibold text-[#111321]">aynı e-posta</strong>{" "}
        ile giriş yapıp <strong className="font-semibold text-[#111321]">Hesabım</strong>
        ’dan yönetebilirsin.
      </p>

      <div className="mt-6 space-y-2">
        <Link href="/hesabim" className="btn-primary w-full">
          Hesabıma git
        </Link>
        <Link href="/giris?next=/hesabim" className="btn-secondary w-full">
          Giriş yap
        </Link>
        <Link
          href="/"
          className="block py-3 text-center text-sm font-bold text-[#6b7280]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </AppShell>
  );
}
