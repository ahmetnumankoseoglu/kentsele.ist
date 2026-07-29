import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/admin";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

function configureVapid() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject =
    process.env.VAPID_SUBJECT?.trim() || "mailto:noreply@kentsele.ist";
  if (!publicKey || !privateKey) {
    console.warn("[push] VAPID keys missing — skip send");
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

async function sendToRows(
  rows: { id: string; endpoint: string; p256dh: string; auth: string }[],
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  if (!rows.length) return { sent: 0, failed: 0 };
  const admin = createServiceClient();
  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "/",
  });

  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: { p256dh: row.p256dh, auth: row.auth },
        },
        body
      );
      sent++;
    } catch (e: unknown) {
      failed++;
      const status =
        e && typeof e === "object" && "statusCode" in e
          ? Number((e as { statusCode: number }).statusCode)
          : 0;
      if (status === 404 || status === 410) {
        await admin.from("push_subscriptions").delete().eq("id", row.id);
      }
    }
  }
  return { sent, failed };
}

/** Tüm abonelere */
export async function sendPushToAll(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  if (!configureVapid()) return { sent: 0, failed: 0 };
  const admin = createServiceClient();
  const { data: rows, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");
  if (error || !rows?.length) return { sent: 0, failed: 0 };
  return sendToRows(rows, payload);
}

/**
 * Onaylı müteahhit abonelerine (yeni yayındaki ilan).
 * contractor_profiles.verification_status = approved + push kaydı olanlar.
 */
export async function sendPushToApprovedContractors(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  if (!configureVapid()) return { sent: 0, failed: 0 };
  const admin = createServiceClient();
  const { data: contractors, error: cErr } = await admin
    .from("contractor_profiles")
    .select("user_id")
    .eq("verification_status", "approved");
  if (cErr || !contractors?.length) return { sent: 0, failed: 0 };

  const userIds = [
    ...new Set(
      contractors
        .map((c: { user_id: string }) => c.user_id)
        .filter(Boolean)
    ),
  ];
  if (!userIds.length) return { sent: 0, failed: 0 };

  const { data: rows, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .in("user_id", userIds);
  if (error || !rows?.length) return { sent: 0, failed: 0 };
  return sendToRows(rows, payload);
}

/** Belirli kullanıcıya (ilan sahibi, müteahhit onayı) */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  if (!userId || !configureVapid()) return { sent: 0, failed: 0 };
  const admin = createServiceClient();
  const { data: rows, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);
  if (error || !rows?.length) return { sent: 0, failed: 0 };
  return sendToRows(rows, payload);
}

/**
 * Olaylara göre push — e-posta ile paralel, hata yutma.
 * Şu an tetiklenenler:
 * - ilan → yayinda: yalnızca onaylı müteahhitlere + sahibe
 * - ilan durum değişimi: sahibe
 * - müteahhit onay/red: müteahhide
 */
export async function pushOnListingStatus(
  listing: {
    id: string;
    slug: string;
    ilce: string;
    owner_user_id?: string | null;
  },
  prevStatus: string,
  nextStatus: string
) {
  if (prevStatus === nextStatus) return;
  try {
    const { getSiteUrl } = await import("@/lib/seo/site");
    const site = getSiteUrl();
    const publicUrl = `${site}/ilan/${listing.slug}`;
    const hesabim = `${site}/hesabim`;

    if (nextStatus === "yayinda") {
      await sendPushToApprovedContractors({
        title: "Yeni kentsel dönüşüm ilanı",
        body: `${listing.ilce} — yayında. Detaylara bak.`,
        url: publicUrl,
      });
      if (listing.owner_user_id) {
        await sendPushToUser(listing.owner_user_id, {
          title: "İlanın yayında",
          body: `${listing.ilce} ilanın onaylandı ve listede.`,
          url: hesabim,
        });
      }
      return;
    }

    if (!listing.owner_user_id) return;

    if (nextStatus === "kaldirildi") {
      await sendPushToUser(listing.owner_user_id, {
        title: "İlan kaldırıldı",
        body: `${listing.ilce} ilanın yayından alındı.`,
        url: hesabim,
      });
    } else if (nextStatus === "anlasildi") {
      await sendPushToUser(listing.owner_user_id, {
        title: "Anlaşma sağlandı",
        body: `${listing.ilce} ilanın anlaşma sağlandı olarak işaretlendi.`,
        url: hesabim,
      });
    } else if (nextStatus === "incelemede") {
      await sendPushToUser(listing.owner_user_id, {
        title: "İlan incelemede",
        body: `${listing.ilce} ilanın yeniden incelemede.`,
        url: hesabim,
      });
    }
  } catch (e) {
    console.error("[push] listing status:", e);
  }
}

export async function pushOnContractorStatus(
  userId: string,
  status: "approved" | "rejected" | "pending"
) {
  if (status !== "approved" && status !== "rejected") return;
  try {
    const { getSiteUrl } = await import("@/lib/seo/site");
    const site = getSiteUrl();
    if (status === "approved") {
      await sendPushToUser(userId, {
        title: "Müteahhit hesabın onaylandı",
        body: "Belgelerin onaylandı. İlanlarda iletişime geçebilirsin.",
        url: `${site}/ilanlar`,
      });
    } else {
      await sendPushToUser(userId, {
        title: "Müteahhit başvurusu güncellendi",
        body: "Başvurun onaylanmadı. Detay için panele bak.",
        url: `${site}/muteahhit`,
      });
    }
  } catch (e) {
    console.error("[push] contractor:", e);
  }
}
