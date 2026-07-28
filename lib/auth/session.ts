import { createServerSupabase } from "@/lib/supabase/server-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import type { Profile, ContractorProfile } from "@/types/user";

export async function getSessionUser() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getSessionUser();
  if (!user) return null;
  try {
    const admin = createServiceClient();
    const { data } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return data as Profile | null;
  } catch {
    return null;
  }
}

export async function getContractorProfile(
  userId: string
): Promise<ContractorProfile | null> {
  try {
    const admin = createServiceClient();
    const { data } = await admin
      .from("contractor_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data as ContractorProfile | null;
  } catch {
    return null;
  }
}

/** Approved contractors may see malik contact numbers */
export async function canViewListingContact(): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.role === "admin") return true;
  if (profile.role !== "muteahhit") return false;
  const c = await getContractorProfile(profile.id);
  return c?.verification_status === "approved";
}
