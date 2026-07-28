import Link from "next/link";

export function BottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e3e4e6] bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-lg p-3">
        <Link href="/ilan-ver" className="btn-primary w-full">
          Malik olarak ilan aç
        </Link>
      </div>
    </div>
  );
}
