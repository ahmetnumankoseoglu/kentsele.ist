import { AppShell } from "@/components/layout/AppShell";
import { IlanVerWizard } from "@/components/ilan-ver/IlanVerWizard";

export default function IlanVerPage() {
  return (
    <AppShell showBottomCta={false}>
      <IlanVerWizard />
    </AppShell>
  );
}
