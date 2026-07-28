"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm font-semibold text-[#6b7280] hover:text-[#ee401d]"
      onClick={async () => {
        const supabase = createBrowserSupabase();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Çıkış
    </button>
  );
}
