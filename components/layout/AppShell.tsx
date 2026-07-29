import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";
import { HomeFooter } from "@/components/home/HomeFooter";
import { LiveBroadcastWidget } from "@/components/canli/LiveBroadcastWidget";

export function AppShell({
  children,
  showBottomCta = true,
  fullBleed = false,
  showFooter = true,
}: {
  children: React.ReactNode;
  showBottomCta?: boolean;
  /** Hero gibi kenar boşluksuz içerik için */
  fullBleed?: boolean;
  /** Ana sayfadaki site footer (varsayılan: açık) */
  showFooter?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#111321]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded-[3px] focus:bg-[#2cb34f] focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        İçeriğe atla
      </a>
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={
          fullBleed
            ? "flex-1 outline-none"
            : "mx-auto w-full max-w-lg flex-1 px-4 pb-8 pt-4 outline-none"
        }
      >
        {children}
      </main>
      {showFooter ? <HomeFooter withBottomCta={showBottomCta} /> : null}
      {showBottomCta ? <BottomCta /> : null}
      <LiveBroadcastWidget liftForBottomCta={showBottomCta} />
    </div>
  );
}
