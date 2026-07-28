import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AdminLoginForm } from "@/components/yonetim/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export default async function YonetimPage() {
  if (await isAdminAuthenticated()) {
    redirect("/yonetim/ilanlar");
  }

  return (
    <AppShell showBottomCta={false}>
      <AdminLoginForm />
    </AppShell>
  );
}
