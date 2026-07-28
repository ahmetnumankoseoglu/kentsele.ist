import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";

export function AppShell({
  children,
  showBottomCta = true,
}: {
  children: React.ReactNode;
  showBottomCta?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-[#F7F6F3] text-slate-900">
      <SiteHeader />
      <main
        className={`mx-auto w-full max-w-lg px-4 pt-4 ${
          showBottomCta ? "pb-28" : "pb-8"
        }`}
      >
        {children}
      </main>
      {showBottomCta ? <BottomCta /> : null}
    </div>
  );
}
