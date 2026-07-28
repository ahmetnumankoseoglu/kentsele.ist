import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";

/**
 * Desktop: gri zemin + ortada geniş beyaz “kutu” (sağ/sol boşluk).
 * Mobile: tam genişlik, rahat padding.
 */
export function AppShell({
  children,
  showBottomCta = true,
  fullBleed = false,
}: {
  children: React.ReactNode;
  showBottomCta?: boolean;
  fullBleed?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-[#e8eaed] text-[#111321]">
      {/* Side gutters on md+ */}
      <div className="mx-auto min-h-dvh w-full max-w-[720px] bg-white shadow-[0_0_0_1px_rgba(17,19,33,0.06),0_12px_40px_rgba(17,19,33,0.08)] lg:max-w-[780px] xl:my-0">
        <SiteHeader />
        <main
          className={
            fullBleed
              ? showBottomCta
                ? "pb-28"
                : "pb-10"
              : `px-4 pt-5 sm:px-6 ${showBottomCta ? "pb-28" : "pb-10"}`
          }
        >
          {children}
        </main>
        {showBottomCta ? <BottomCta /> : null}
      </div>
    </div>
  );
}
