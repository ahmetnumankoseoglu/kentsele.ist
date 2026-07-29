import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";
import { HomeFooter } from "@/components/home/HomeFooter";

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
      <SiteHeader />
      <main
        className={
          fullBleed
            ? "flex-1"
            : "mx-auto w-full max-w-lg flex-1 px-4 pb-8 pt-4"
        }
      >
        {children}
      </main>
      {showFooter ? <HomeFooter withBottomCta={showBottomCta} /> : null}
      {showBottomCta ? <BottomCta /> : null}
    </div>
  );
}
