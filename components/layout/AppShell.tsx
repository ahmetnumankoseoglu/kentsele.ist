import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";

export function AppShell({
  children,
  showBottomCta = true,
  fullBleed = false,
}: {
  children: React.ReactNode;
  showBottomCta?: boolean;
  /** Hero gibi kenar boşluksuz içerik için */
  fullBleed?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-white text-[#111321]">
      <SiteHeader />
      <main
        className={
          fullBleed
            ? showBottomCta
              ? "pb-28"
              : "pb-8"
            : `mx-auto w-full max-w-lg px-4 pt-4 ${
                showBottomCta ? "pb-28" : "pb-8"
              }`
        }
      >
        {children}
      </main>
      {showBottomCta ? <BottomCta /> : null}
    </div>
  );
}
