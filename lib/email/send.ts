import { getSiteUrl } from "@/lib/seo/site";
import { getAdminNotifyEmail, sendEmail } from "./resend";
import * as T from "./templates";
import type { Listing } from "@/types/listing";

function listingCtx(listing: Listing) {
  const site = getSiteUrl();
  return {
    name: listing.iletisim_adi,
    ilce: listing.ilce,
    mahalle: listing.mahalle,
    kat: listing.kat_sayisi,
    daire: listing.daire_sayisi,
    manageUrl: `${site}/yonet/${listing.manage_token}`,
    publicUrl: `${site}/ilan/${listing.slug}`,
  };
}

function toEmail(listing: Listing): string | null {
  const e = listing.email?.trim();
  if (!e || !e.includes("@")) return null;
  return e;
}

/** Fire after listing create — malik + optional admin */
export async function emailOnListingCreated(listing: Listing) {
  const ctx = listingCtx(listing);
  const to = toEmail(listing);
  if (to) {
    const received = T.templateListingReceived(ctx);
    await sendEmail({ to, ...received });

    // Invite to activate account (same address)
    const activate = T.templateActivateAccount({
      name: listing.iletisim_adi,
      email: to,
      manageUrl: ctx.manageUrl,
    });
    await sendEmail({ to, ...activate });
  }

  const adminTo = getAdminNotifyEmail();
  if (adminTo) {
    const adminMail = T.templateAdminNewListing({
      ...ctx,
      listingId: listing.id,
    });
    await sendEmail({ to: adminTo, ...adminMail });
  }
}

/** After admin status change */
export async function emailOnListingStatusChange(
  listing: Listing,
  prevStatus: string,
  nextStatus: string
) {
  if (prevStatus === nextStatus) return;
  const to = toEmail(listing);
  if (!to) return;
  const ctx = listingCtx(listing);

  if (nextStatus === "yayinda" || nextStatus === "teklif_saglaniyor") {
    if (prevStatus !== "yayinda" && prevStatus !== "teklif_saglaniyor") {
      const mail = T.templateListingPublished(ctx);
      await sendEmail({ to, ...mail });
    }
    return;
  }
  if (nextStatus === "incelemede" && prevStatus !== "incelemede") {
    // Only if was public before (edit re-review)
    if (
      prevStatus === "yayinda" ||
      prevStatus === "teklif_saglaniyor" ||
      prevStatus === "anlasildi"
    ) {
      const mail = T.templateListingBackToReview(ctx);
      await sendEmail({ to, ...mail });
    }
    return;
  }
  if (nextStatus === "anlasildi") {
    const mail = T.templateListingAgreed(ctx);
    await sendEmail({ to, ...mail });
    return;
  }
  if (nextStatus === "kaldirildi") {
    const mail = T.templateListingRemoved(ctx);
    await sendEmail({ to, ...mail });
  }
}

export async function emailOnSignup(opts: {
  email: string;
  full_name: string;
  role: "malik" | "muteahhit";
  company_name?: string;
}) {
  if (opts.role === "muteahhit") {
    const mail = T.templateWelcomeContractor({
      name: opts.full_name,
      company: opts.company_name,
    });
    await sendEmail({ to: opts.email, ...mail });
  } else {
    const mail = T.templateWelcomeMalik({ name: opts.full_name });
    await sendEmail({ to: opts.email, ...mail });
  }
}

export async function emailOnContractorStatus(opts: {
  email: string;
  name: string;
  status: "approved" | "rejected" | "pending";
  reason?: string | null;
}) {
  if (opts.status === "approved") {
    const mail = T.templateContractorApproved({ name: opts.name });
    await sendEmail({ to: opts.email, ...mail });
  } else if (opts.status === "rejected") {
    const mail = T.templateContractorRejected({
      name: opts.name,
      reason: opts.reason,
    });
    await sendEmail({ to: opts.email, ...mail });
  }
}

export async function emailAdminContactMessage(opts: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  body: string;
}) {
  const adminTo = getAdminNotifyEmail();
  if (!adminTo) return;
  const mail = T.templateAdminContactNotify(opts);
  await sendEmail({
    to: adminTo,
    replyTo: opts.email,
    ...mail,
  });
}
