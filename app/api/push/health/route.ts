import { NextResponse } from "next/server";
import webpush from "web-push";

function clean(raw: string | undefined) {
  return (raw ?? "").trim().replace(/^["']|["']$/g, "").replace(/\s+/g, "");
}

function b64urlToBuf(s: string) {
  const p = "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(
    (s + p).replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );
}

/**
 * Push yapılandırma sağlığı — tarayıcı aboneliği için public key yeterli;
 * private key yalnızca gönderim için.
 */
export async function GET() {
  const publicKey = clean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY
  );
  const privateKey = clean(process.env.VAPID_PRIVATE_KEY);
  const subject = clean(process.env.VAPID_SUBJECT) || "mailto:noreply@kentsele.ist";

  let publicOk = false;
  let publicBytes = 0;
  let publicFirst = -1;
  if (publicKey) {
    try {
      const b = b64urlToBuf(publicKey);
      publicBytes = b.length;
      publicFirst = b[0] ?? -1;
      publicOk = b.length === 65 && b[0] === 4;
    } catch {
      publicOk = false;
    }
  }

  let privateOk = false;
  let privateBytes = 0;
  if (privateKey) {
    try {
      const b = b64urlToBuf(privateKey);
      privateBytes = b.length;
      privateOk = b.length === 32;
    } catch {
      privateOk = false;
    }
  }

  let vapidPairOk = false;
  let vapidError: string | null = null;
  if (publicOk && privateOk) {
    try {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      vapidPairOk = true;
    } catch (e) {
      vapidError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    ok: publicOk,
    // Abone olmak için public yeter; gönderim için private da lazım
    canSubscribe: publicOk,
    canSend: publicOk && privateOk && vapidPairOk,
    publicKeyPresent: Boolean(publicKey),
    publicKeyChars: publicKey.length,
    publicKeyBytes: publicBytes,
    publicKeyValid: publicOk,
    publicKeyPrefix: publicKey ? publicKey.slice(0, 8) + "…" : null,
    privateKeyPresent: Boolean(privateKey),
    privateKeyBytes: privateBytes,
    privateKeyValid: privateOk,
    subject,
    vapidPairOk,
    vapidError,
    hint: !publicOk
      ? "NEXT_PUBLIC_VAPID_PUBLIC_KEY veya VAPID_PUBLIC_KEY eksik/hatalı."
      : !privateOk
        ? "Public key OK. VAPID_PRIVATE_KEY eksik — abone olunur ama bildirim gönderilemez."
        : !vapidPairOk
          ? "Public/private anahtar çifti web-push tarafından reddedildi."
          : "Sunucu VAPID yapılandırması sağlıklı. Tarayıcı push service hatası ortam kaynaklı olabilir (SW controller, FCM engeli, Brave ayarı).",
  });
}
