import Link from "next/link";

export function BottomCta() {
  return (
    <div className="sticky bottom-0 z-40 border-t border-[#e3e4e6] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="p-3 sm:px-6">
        <Link href="/ilan-ver" className="btn-primary w-full">
          Ücretsiz İlan Ver
        </Link>
      </div>
    </div>
  );
}
