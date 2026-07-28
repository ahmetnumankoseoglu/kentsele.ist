"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm font-semibold text-[#6b7280] hover:text-[#ee401d]"
      onClick={async () => {
        try {
          const { createBrowserSupabase } = await import(
            "@/lib/supabase/browser"
          );
          const supabase = createBrowserSupabase();
          await supabase.auth.signOut();
        } catch {
          /* ignore */
        }
        router.push("/");
        router.refresh();
      }}
    >
      Çıkış
    </button>
  );
}
