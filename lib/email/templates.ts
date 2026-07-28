import { PRODUCTION_SITE_URL } from "@/lib/seo/site";
import {
  emailLayout,
  escapeHtml,
  metaBox,
  p,
  plainFromLines,
  strong,
} from "./layout";

const site = PRODUCTION_SITE_URL;

export type ListingEmailCtx = {
  name: string;
  ilce: string;
  mahalle?: string | null;
  kat?: string;
  daire?: string;
  manageUrl?: string;
  publicUrl?: string;
};

function listingMeta(ctx: ListingEmailCtx) {
  return metaBox([
    { label: "İlçe", value: ctx.ilce },
    ...(ctx.mahalle ? [{ label: "Mahalle", value: ctx.mahalle }] : []),
    ...(ctx.kat && ctx.daire
      ? [{ label: "Bina", value: `${ctx.kat} kat · ${ctx.daire} daire` }]
      : []),
  ]);
}

/** 1) İlan alındı — incelemede */
export function templateListingReceived(ctx: ListingEmailCtx) {
  const title = "İlanınız alındı — incelemede";
  const html = emailLayout({
    title,
    preheader: `${ctx.ilce} ilanınız ekibimiz tarafından inceleniyor.`,
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "Kentsel dönüşüm ilanınızı aldık. Ekibimiz kısa bir teyit süreci yürütür; onay sonrası ilanınız yayına alınır."
      ),
      listingMeta(ctx),
      p(
        "Düzenlemek veya durumunu takip etmek için aşağıdaki yönetim bağlantısını saklayın. Bu linke erişim için ilandaki e-posta ile giriş yapmanız gerekir."
      ),
    ].join(""),
    cta: ctx.manageUrl
      ? { label: "İlanımı yönet", href: ctx.manageUrl }
      : undefined,
    footerNote:
      "Bu e-posta, ilan formunda verdiğiniz adrese otomatik gönderilmiştir.",
  });
  return {
    subject: `İlanınız incelemede · ${ctx.ilce} · kentsele.ist`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `${ctx.ilce} kentsel dönüşüm ilanınız incelemede.`,
      ctx.manageUrl ? `Yönetim: ${ctx.manageUrl}` : "",
    ]),
  };
}

/** 2) İlan yayında */
export function templateListingPublished(ctx: ListingEmailCtx) {
  const title = "İlanınız yayında";
  const html = emailLayout({
    title,
    preheader: `${ctx.ilce} ilanınız onaylandı ve yayında.`,
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "Tebrikler — ilanınız onaylandı ve İstanbul kentsel dönüşüm listesinde yayında. Onaylı müteahhitler ilanınızı görebilir ve sizinle iletişime geçebilir."
      ),
      listingMeta(ctx),
    ].join(""),
    cta: ctx.publicUrl
      ? { label: "İlanı görüntüle", href: ctx.publicUrl }
      : ctx.manageUrl
        ? { label: "İlanımı yönet", href: ctx.manageUrl }
        : undefined,
  });
  return {
    subject: `İlanınız yayında · ${ctx.ilce} · kentsele.ist`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `${ctx.ilce} ilanınız yayında.`,
      ctx.publicUrl || "",
    ]),
  };
}

/** 3) İlan tekrar incelemeye alındı (malik düzenledi) */
export function templateListingBackToReview(ctx: ListingEmailCtx) {
  const title = "İlanınız yeniden incelemede";
  const html = emailLayout({
    title,
    preheader: "Yaptığınız güncelleme nedeniyle ilan yeniden incelenecek.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "İlanınızda yaptığınız değişiklikler nedeniyle kayıt yeniden inceleme kuyruğuna alındı. Onay sonrası tekrar yayına alınacaktır."
      ),
      listingMeta(ctx),
    ].join(""),
    cta: ctx.manageUrl
      ? { label: "İlanımı yönet", href: ctx.manageUrl }
      : undefined,
  });
  return {
    subject: `İlan yeniden incelemede · ${ctx.ilce}`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `${ctx.ilce} ilanınız yeniden incelemede.`,
    ]),
  };
}

/** 4) Anlaşma sağlandı */
export function templateListingAgreed(ctx: ListingEmailCtx) {
  const title = "Anlaşma sağlandı olarak işaretlendi";
  const html = emailLayout({
    title,
    preheader: "İlanınız artık teklife kapalı.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "İlanınız “Anlaşma sağlandı” durumuna alındı. İletişim bilgileri müteahhitlere kapalıdır; ilan arşiv görünümünde kalabilir."
      ),
      listingMeta(ctx),
    ].join(""),
    cta: ctx.manageUrl
      ? { label: "İlanımı yönet", href: ctx.manageUrl }
      : undefined,
  });
  return {
    subject: `Anlaşma sağlandı · ${ctx.ilce}`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `${ctx.ilce} ilanınız anlaşma sağlandı olarak işaretlendi.`,
    ]),
  };
}

/** 5) İlan kaldırıldı */
export function templateListingRemoved(ctx: ListingEmailCtx) {
  const title = "İlanınız yayından kaldırıldı";
  const html = emailLayout({
    title,
    preheader: "İlanınız artık listelerde görünmüyor.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "İlanınız yayından kaldırıldı. Yeniden yayınlamak isterseniz yönetim panelinden güncelleyebilir veya yeni ilan oluşturabilirsiniz."
      ),
      listingMeta(ctx),
    ].join(""),
    cta: { label: "Yeni ilan ver", href: `${site}/ilan-ver` },
  });
  return {
    subject: `İlan kaldırıldı · ${ctx.ilce}`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `${ctx.ilce} ilanınız kaldırıldı.`,
    ]),
  };
}

/** 6) Hesap / üyelik aktifleştir (ilan e-postası ile kayıt çağrısı) */
export function templateActivateAccount(ctx: {
  name: string;
  email: string;
  manageUrl?: string;
}) {
  const title = "Hesabını aktifleştir — ilanını kolay yönet";
  const registerUrl = `${site}/kayit?next=${encodeURIComponent(ctx.manageUrl || "/hesabim")}`;
  const html = emailLayout({
    title,
    preheader: "Aynı e-posta ile kayıt ol, ilanlarını tek yerden yönet.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        `kentsele.ist’te ilan oluşturdun. <strong style="color:#111321;">${ctx.email}</strong> adresiyle ücretsiz hesap açarsan ilanlarını “Hesabım”dan takip edebilir, düzenleyebilirsin.`
      ),
      p(
        "Önemli: İlan düzenleme yetkisi, ilanda yazdığın e-posta ile giriş yaptığında geçerlidir."
      ),
    ].join(""),
    cta: { label: "Ücretsiz kayıt ol", href: registerUrl },
  });
  return {
    subject: "Üyeliğini aktifleştir · kentsele.ist",
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `Hesap aç: ${registerUrl}`,
    ]),
  };
}

/** 7) Malik hoş geldin */
export function templateWelcomeMalik(ctx: { name: string }) {
  const title = "Hoş geldin — malik hesabın hazır";
  const html = emailLayout({
    title,
    preheader: "Ücretsiz ilan ver, onaylı müteahhitlerle buluş.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "kentsele.ist malik hesabın oluşturuldu. İstanbul’da kentsel dönüşüm ilanı vermek ücretsizdir; iletişim yalnızca onaylı müteahhitlere açılır."
      ),
    ].join(""),
    cta: { label: "İlan ver", href: `${site}/ilan-ver` },
  });
  return {
    subject: "Hoş geldin · kentsele.ist",
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      "Malik hesabın hazır. İlan ver: " + `${site}/ilan-ver`,
    ]),
  };
}

/** 8) Müteahhit hoş geldin */
export function templateWelcomeContractor(ctx: {
  name: string;
  company?: string;
}) {
  const title = "Müteahhit kaydın alındı";
  const html = emailLayout({
    title,
    preheader: "Belge yükle, onay sonrası malik iletişimini gör.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        ctx.company
          ? `${strong(ctx.company)} için müteahhit kaydın oluşturuldu.`
          : "Müteahhit kaydın oluşturuldu."
      ),
      p(
        "Vergi levhası ve diğer belgeleri paneline yükle. Onay sonrası yayındaki ilanlarda malik telefonunu görebilirsin."
      ),
    ].join(""),
    cta: { label: "Belge yükle", href: `${site}/muteahhit` },
  });
  return {
    subject: "Müteahhit kaydın alındı · kentsele.ist",
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      `Belge paneli: ${site}/muteahhit`,
    ]),
  };
}

/** 9) Müteahhit onaylandı */
export function templateContractorApproved(ctx: { name: string }) {
  const title = "Hesabın onaylandı — iletişim açık";
  const html = emailLayout({
    title,
    preheader: "Artık malik numaralarını görebilirsin.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "Belgelerin incelendi ve hesabın onaylandı. Yayındaki kentsel dönüşüm ilanlarında malik iletişim bilgisine erişebilirsin."
      ),
    ].join(""),
    cta: { label: "İlanlara git", href: `${site}/ilanlar` },
  });
  return {
    subject: "Müteahhit hesabın onaylandı · kentsele.ist",
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      "Hesabın onaylandı. " + `${site}/ilanlar`,
    ]),
  };
}

/** 10) Müteahhit reddedildi */
export function templateContractorRejected(ctx: {
  name: string;
  reason?: string | null;
}) {
  const title = "Belge incelemesi tamamlanamadı";
  const html = emailLayout({
    title,
    preheader: "Hesabın onaylanmadı — detayları oku.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "Müteahhit doğrulama başvurun şu an onaylanmadı. Eksik veya geçersiz belge varsa paneldan yeniden yükleyebilirsin."
      ),
      ctx.reason
        ? p(
            `<strong style="color:#111321;">Not:</strong> ${escapeHtml(ctx.reason)}`
          )
        : "",
    ].join(""),
    cta: { label: "Panele git", href: `${site}/muteahhit` },
  });
  return {
    subject: "Müteahhit başvurusu güncellendi · kentsele.ist",
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      "Başvurun onaylanmadı.",
      ctx.reason || "",
    ]),
  };
}

/** 11) Admin’e yeni iletişim mesajı */
export function templateAdminContactNotify(ctx: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  body: string;
}) {
  const title = "Yeni iletişim mesajı";
  const html = emailLayout({
    title,
    preheader: ctx.subject,
    bodyHtml: [
      metaBox([
        { label: "Ad", value: ctx.name },
        { label: "E-posta", value: ctx.email },
        ...(ctx.phone ? [{ label: "Telefon", value: ctx.phone }] : []),
        { label: "Konu", value: ctx.subject },
      ]),
      p(escapeHtml(ctx.body).replace(/\n/g, "<br/>")),
    ].join(""),
    cta: { label: "Yönetim paneli", href: `${site}/yonetim/iletisim` },
  });
  return {
    subject: `[İletişim] ${ctx.subject}`,
    html,
    text: plainFromLines([
      ctx.name,
      ctx.email,
      ctx.subject,
      ctx.body,
    ]),
  };
}

/** 12) Admin’e yeni ilan bildirimi */
export function templateAdminNewListing(ctx: ListingEmailCtx & { listingId: string }) {
  const title = "Yeni ilan — inceleme bekliyor";
  const html = emailLayout({
    title,
    preheader: `${ctx.ilce} · ${ctx.name}`,
    bodyHtml: [
      p("Yeni bir kentsel dönüşüm ilanı oluşturuldu."),
      listingMeta(ctx),
      metaBox([{ label: "İletişim", value: ctx.name }]),
    ].join(""),
    cta: {
      label: "Admin’de aç",
      href: `${site}/yonetim/ilanlar/${ctx.listingId}`,
    },
  });
  return {
    subject: `[İlan] ${ctx.ilce} · inceleme`,
    html,
    text: plainFromLines([`Yeni ilan: ${ctx.ilce}`, ctx.name]),
  };
}

/** 13) Kullanıcıya: iletişim formu alındı (otomatik) */
export function templateContactReceivedAck(ctx: {
  name: string;
  subject: string;
}) {
  const title = "Mesajın bize ulaştı";
  const html = emailLayout({
    title,
    preheader: "İletişim formundaki mesajın alındı.",
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p(
        "kentsele.ist iletişim formundan gönderdiğin mesajı aldık. Ekibimiz en kısa sürede e-posta ile dönüş yapacak."
      ),
      metaBox([{ label: "Konu", value: ctx.subject }]),
      p("Bu otomatik bir bilgilendirme mesajıdır; bu e-postaya yanıt vermen gerekmez."),
    ].join(""),
    cta: { label: "Siteye git", href: site },
  });
  return {
    subject: `Mesajın alındı · ${ctx.subject}`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      "Mesajını aldık. En kısa sürede dönüş yapacağız.",
      `Konu: ${ctx.subject}`,
    ]),
  };
}

/** 14) Kullanıcıya: admin cevabı */
export function templateContactAdminReply(ctx: {
  name: string;
  subject: string;
  originalBody: string;
  reply: string;
}) {
  const title = "Mesajına yanıt";
  const html = emailLayout({
    title,
    preheader: `Re: ${ctx.subject}`,
    bodyHtml: [
      p(`Merhaba ${strong(ctx.name)},`),
      p("İletişim formundan ilettiğin mesaja yanıtımız:"),
      p(
        `<div style="margin:0 0 14px;padding:12px 14px;background:#f8f8f8;border-radius:3px;border:1px solid #e3e4e6;color:#111321;white-space:pre-wrap;">${escapeHtml(ctx.reply)}</div>`
      ),
      p(
        `<strong style="color:#111321;">Senin mesajın:</strong><br/><span style="color:#6b7280;">${escapeHtml(ctx.originalBody).replace(/\n/g, "<br/>")}</span>`
      ),
      p("Başka soruların olursa sitemizdeki iletişim formundan tekrar yazabilirsin."),
    ].join(""),
    cta: { label: "İletişim", href: `${site}/iletisim` },
  });
  return {
    subject: `Yanıt: ${ctx.subject}`,
    html,
    text: plainFromLines([
      `Merhaba ${ctx.name},`,
      "Yanıtımız:",
      ctx.reply,
      "—",
      "Senin mesajın:",
      ctx.originalBody,
    ]),
  };
}
