import { getSiteUrl } from "@/lib/seo/site";
import { getAdminNotifyEmail, sendTemplateEmail } from "./resend";
import * as T from "./templates";
import type { Listing } from "@/types/listing";

function listingVars(listing: Listing) {
  const site = getSiteUrl();
  const building =
    listing.kat_sayisi && listing.daire_sayisi
      ? `${listing.kat_sayisi} kat · ${listing.daire_sayisi} daire`
      : "—";
  return {
    PREVIEW_TEXT: `${listing.ilce} ilanınız hakkında bilgilendirme`,
    NAME: listing.iletisim_adi,
    ILCE: listing.ilce,
    MAHALLE: listing.mahalle?.trim() || "—",
    BUILDING: building,
    MANAGE_URL: `${site}/yonet/${listing.manage_token}`,
    PUBLIC_URL: `${site}/ilan/${listing.slug}`,
    ILAN_VER_URL: `${site}/ilan-ver`,
    LISTING_ADMIN_URL: `${site}/yonetim/ilanlar/${listing.id}`,
  };
}

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
  const vars = listingVars(listing);
  const to = toEmail(listing);
  const site = getSiteUrl();

  if (to) {
    const received = T.templateListingReceived(ctx);
    await sendTemplateEmail({
      to,
      alias: "listing-received",
      variables: vars,
      fallback: { to, ...received },
    });

    const registerUrl = `${site}/kayit?next=${encodeURIComponent(vars.MANAGE_URL)}`;
    const activate = T.templateActivateAccount({
      name: listing.iletisim_adi,
      email: to,
      manageUrl: vars.MANAGE_URL,
    });
    await sendTemplateEmail({
      to,
      alias: "activate-account",
      variables: {
        PREVIEW_TEXT: "Aynı e-posta ile kayıt ol, ilanını kolay yönet.",
        NAME: listing.iletisim_adi,
        USER_EMAIL: to,
        REGISTER_URL: registerUrl,
      },
      fallback: { to, ...activate },
    });
  }

  const adminTo = getAdminNotifyEmail();
  if (adminTo) {
    const adminMail = T.templateAdminNewListing({
      ...ctx,
      listingId: listing.id,
    });
    await sendTemplateEmail({
      to: adminTo,
      alias: "admin-new-listing",
      variables: vars,
      fallback: { to: adminTo, ...adminMail },
    });
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
  const vars = listingVars(listing);

  if (nextStatus === "yayinda" || nextStatus === "teklif_saglaniyor") {
    if (prevStatus !== "yayinda" && prevStatus !== "teklif_saglaniyor") {
      const mail = T.templateListingPublished(ctx);
      await sendTemplateEmail({
        to,
        alias: "listing-published",
        variables: {
          ...vars,
          PREVIEW_TEXT: `${listing.ilce} ilanınız onaylandı ve yayında.`,
        },
        fallback: { to, ...mail },
      });
    }
    return;
  }
  if (nextStatus === "incelemede" && prevStatus !== "incelemede") {
    if (
      prevStatus === "yayinda" ||
      prevStatus === "teklif_saglaniyor" ||
      prevStatus === "anlasildi"
    ) {
      const mail = T.templateListingBackToReview(ctx);
      await sendTemplateEmail({
        to,
        alias: "listing-back-to-review",
        variables: {
          ...vars,
          PREVIEW_TEXT: "Güncellemeniz nedeniyle ilan yeniden incelemede.",
        },
        fallback: { to, ...mail },
      });
    }
    return;
  }
  if (nextStatus === "anlasildi") {
    const mail = T.templateListingAgreed(ctx);
    await sendTemplateEmail({
      to,
      alias: "listing-agreed",
      variables: {
        ...vars,
        PREVIEW_TEXT: "İlanınız anlaşma sağlandı olarak işaretlendi.",
      },
      fallback: { to, ...mail },
    });
    return;
  }
  if (nextStatus === "kaldirildi") {
    const mail = T.templateListingRemoved(ctx);
    await sendTemplateEmail({
      to,
      alias: "listing-removed",
      variables: {
        ...vars,
        PREVIEW_TEXT: "İlanınız yayından kaldırıldı.",
      },
      fallback: { to, ...mail },
    });
  }
}

/** Şifre sıfırlama — bağlantı Supabase generateLink, gönderim Resend */
export async function emailPasswordReset(opts: {
  email: string;
  resetUrl: string;
  name?: string | null;
}) {
  const mail = T.templatePasswordReset({
    name: opts.name,
    resetUrl: opts.resetUrl,
  });
  return sendTemplateEmail({
    to: opts.email,
    alias: "password-reset",
    variables: {
      PREVIEW_TEXT: "Şifreni sıfırlamak için bağlantı.",
      NAME: opts.name?.trim() || "Kullanıcı",
      RESET_URL: opts.resetUrl,
    },
    fallback: { to: opts.email, ...mail },
  });
}

export async function emailOnSignup(opts: {
  email: string;
  full_name: string;
  role: "malik" | "muteahhit";
  company_name?: string;
}) {
  const site = getSiteUrl();
  if (opts.role === "muteahhit") {
    const mail = T.templateWelcomeContractor({
      name: opts.full_name,
      company: opts.company_name,
    });
    await sendTemplateEmail({
      to: opts.email,
      alias: "welcome-contractor",
      variables: {
        PREVIEW_TEXT: "Belge yükle, onay sonrası iletişime geç.",
        NAME: opts.full_name,
        COMPANY: opts.company_name || "Firma",
        MUTEAHHIT_URL: `${site}/muteahhit`,
      },
      fallback: { to: opts.email, ...mail },
    });
  } else {
    const mail = T.templateWelcomeMalik({ name: opts.full_name });
    await sendTemplateEmail({
      to: opts.email,
      alias: "welcome-malik",
      variables: {
        PREVIEW_TEXT: "Malik hesabın hazır — ücretsiz ilan ver.",
        NAME: opts.full_name,
        ILAN_VER_URL: `${site}/ilan-ver`,
      },
      fallback: { to: opts.email, ...mail },
    });
  }
}

export async function emailOnContractorStatus(opts: {
  email: string;
  name: string;
  status: "approved" | "rejected" | "pending";
  reason?: string | null;
}) {
  const site = getSiteUrl();
  if (opts.status === "approved") {
    const mail = T.templateContractorApproved({ name: opts.name });
    await sendTemplateEmail({
      to: opts.email,
      alias: "contractor-approved",
      variables: {
        PREVIEW_TEXT: "Hesabın onaylandı — malik iletişimleri açık.",
        NAME: opts.name,
        ILANLAR_URL: `${site}/ilanlar`,
      },
      fallback: { to: opts.email, ...mail },
    });
  } else if (opts.status === "rejected") {
    const mail = T.templateContractorRejected({
      name: opts.name,
      reason: opts.reason,
    });
    await sendTemplateEmail({
      to: opts.email,
      alias: "contractor-rejected",
      variables: {
        PREVIEW_TEXT: "Başvurun onaylanmadı — detaylara bak.",
        NAME: opts.name,
        REASON:
          opts.reason?.trim() ||
          "Belgeleri paneldan yeniden yükleyebilirsin.",
        MUTEAHHIT_URL: `${site}/muteahhit`,
      },
      fallback: { to: opts.email, ...mail },
    });
  }
}

export async function emailAdminContactMessage(opts: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  body: string;
}) {
  const site = getSiteUrl();

  // Auto-ack to the user
  const ack = T.templateContactReceivedAck({
    name: opts.name,
    subject: opts.subject,
  });
  await sendTemplateEmail({
    to: opts.email,
    alias: "contact-received",
    variables: {
      PREVIEW_TEXT: "Mesajın bize ulaştı.",
      NAME: opts.name,
      SUBJECT: opts.subject,
      SITE_URL: site,
    },
    fallback: { to: opts.email, ...ack },
  });

  const adminTo = getAdminNotifyEmail();
  if (!adminTo) return;
  const mail = T.templateAdminContactNotify(opts);
  await sendTemplateEmail({
    to: adminTo,
    alias: "admin-contact",
    replyTo: opts.email,
    variables: {
      PREVIEW_TEXT: `Yeni mesaj: ${opts.subject}`,
      CONTACT_NAME: opts.name,
      CONTACT_EMAIL: opts.email,
      PHONE: opts.phone?.trim() || "—",
      SUBJECT: opts.subject,
      BODY: opts.body,
      ADMIN_URL: `${site}/yonetim/iletisim`,
    },
    fallback: {
      to: adminTo,
      replyTo: opts.email,
      ...mail,
    },
  });
}

/** Admin replied to a contact form message */
export async function emailContactAdminReply(opts: {
  name: string;
  email: string;
  subject: string;
  originalBody: string;
  reply: string;
}) {
  const site = getSiteUrl();
  const mail = T.templateContactAdminReply(opts);
  await sendTemplateEmail({
    to: opts.email,
    alias: "contact-reply",
    variables: {
      PREVIEW_TEXT: `Yanıt: ${opts.subject}`,
      NAME: opts.name,
      SUBJECT: opts.subject,
      ORIGINAL_BODY: opts.originalBody,
      REPLY_BODY: opts.reply,
      ILETISIM_URL: `${site}/iletisim`,
    },
    fallback: { to: opts.email, ...mail },
  });
}
