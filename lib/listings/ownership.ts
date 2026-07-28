/** İlan sahibi e-posta eşleşmesi (normalize) */
export function emailsMatch(
  a?: string | null,
  b?: string | null
): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Malik düzenleme yetkisi:
 * - Oturum e-postası = ilan e-postası (zorunlu eşleşme), veya
 * - owner_user_id = profil id ve e-posta da uyuyorsa / ilan e-postası yoksa owner id
 *
 * Token tek başına yetmez; e-posta hesabı ile giriş şart.
 */
export function canOwnerEditListing(opts: {
  profileId: string;
  userEmail?: string | null;
  listing: {
    email?: string | null;
    owner_user_id?: string | null;
  };
}): boolean {
  const { profileId, userEmail, listing } = opts;
  const byEmail = emailsMatch(userEmail, listing.email);
  if (byEmail) return true;

  // Eski kayıtlar: e-posta yok ama owner zaten bu hesap
  if (
    !listing.email &&
    listing.owner_user_id &&
    listing.owner_user_id === profileId
  ) {
    return true;
  }

  return false;
}
