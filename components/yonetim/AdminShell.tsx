import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f8f8f8] text-[#111321]">
      <AdminHeader />
      <main className="mx-auto w-full max-w-lg px-4 pb-10 pt-5">{children}</main>
    </div>
  );
}
