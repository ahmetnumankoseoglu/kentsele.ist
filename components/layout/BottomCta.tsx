import Link from "next/link";

export function BottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-lg gap-2 p-3">
        <Link
          href="/ilan-ver"
          className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0B6E4F] text-sm font-semibold text-white"
        >
          Ücretsiz ilan ver
        </Link>
      </div>
    </div>
  );
}
