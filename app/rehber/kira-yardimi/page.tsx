import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";

const TITLE = "Kentsel dönüşüm kira yardımı nedir? Nasıl alınır?";
const DESCRIPTION =
  "Kira yardımı ve taşınma yardımı başvurusu: malik, konut kiracısı ve iş yeri kiracısı için istenen belgeler, başvuru adımları ve SSS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "kentsel dönüşüm kira yardımı",
    "kira yardımı evrak listesi",
    "taşınma yardımı belgeler",
    "malik kira yardımı başvuru",
    "kiracı taşınma yardımı",
    "6306 kira yardımı",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "tr_TR",
  },
  alternates: {
    canonical: `${getSiteUrl()}/rehber/kira-yardimi`,
  },
};

const FAQ = [
  {
    q: "Kira yardımı ile taşınma yardımı aynı mı?",
    a: "Hayır. Kira yardımı genelde malik başvurularıyla ilişkilendirilen süreli barınma desteğidir. Taşınma yardımı ise (Yarısı Bizden paketindeki 125.000 ₺ kalemi ve/veya kiracı taşınma başvuruları) ayrı dosya ve formlarla (Ek-2, Ek-3) yürütülür. Kurumun verdiği güncel form ve liste esas alınır.",
  },
  {
    q: "Malik başvurusunda hangi form kullanılır?",
    a: "Malik kira yardımı başvurularında Ek-1 Başvuru Formu kullanılır; form kurumda verilir.",
  },
  {
    q: "Konut kiracısı ve iş yeri kiracısı aynı belgeleri mi verir?",
    a: "Hayır. Konut kiracıları Ek-2; iş yeri kiracıları Ek-3 formunu kullanır. Konut kiracısında adrese dayalı nüfus kaydı / fatura; iş yeri kiracısında vergi levhası (eski ve yeni adres) istenir.",
  },
  {
    q: "Tapu arsa paylıysa ne gerekir?",
    a: "Malik başvurularında tapu arsa paylı ise bağımsız birimin kime ait olduğunu gösteren, belediyeden alınmış imzalı-mühürlü Emlak Vergi Beyannamesi (bağımsız birim no ve hisse oranı) veya malik adına son 3 aya ait elektrik/su/doğalgaz faturasından biri (açık adres ve bağımsız bölüm no) istenir.",
  },
  {
    q: "Vekâletname ile başvuru yapılabilir mi?",
    a: "Evet. Vekâletnamede “6306 sayılı Kanun kapsamında yapılacak kira yardımı başvurusu için yetki verilmesi” ibaresi bulunmalı; vekilin kimlik aslı ve fotokopisi eklenmelidir.",
  },
  {
    q: "IBAN hangi bankadan olmalı?",
    a: "Kamu bankalarına ait IBAN gösteren hesap cüzdanı fotokopisi istenir. Mümkünse Ziraat Bankası veya Halkbankası tercih edilir. İş yeri kiracılarında listede Ziraat Bankası IBAN vurgulanır.",
  },
] as const;

function BelgeListesi({
  title,
  items,
  note,
}: {
  title: string;
  items: { baslik: string; alt?: string[] }[];
  note?: string;
}) {
  return (
    <div className="card not-prose mt-3 p-4">
      <h3 className="text-sm font-bold text-[#168f43]">{title}</h3>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-[#374151]">
        {items.map((item) => (
          <li key={item.baslik}>
            <span className="font-semibold text-[#111321]">{item.baslik}</span>
            {item.alt && item.alt.length > 0 && (
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#6b7280]">
                {item.alt.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      {note ? (
        <p className="mt-3 text-xs font-medium text-[#b45309]">{note}</p>
      ) : null}
    </div>
  );
}

export default function KiraYardimiPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      inLanguage: "tr-TR",
      author: { "@type": "Organization", name: "kentsele.ist" },
      publisher: {
        "@type": "Organization",
        name: "kentsele.ist",
        url: getSiteUrl(),
      },
      mainEntityOfPage: `${getSiteUrl()}/rehber/kira-yardimi`,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Kentsel dönüşüm kira yardımı başvurusu nasıl yapılır?",
      description:
        "Malik kira yardımı ve kiracı taşınma yardımı için genel başvuru adımları.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Başvuru türünü belirle",
          text: "Malik kira yardımı (Ek-1), konut kiracısı taşınma (Ek-2) veya iş yeri kiracısı taşınma (Ek-3).",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Evrak listesini sıraya diz",
          text: "Kurumun istediği sıraya göre kimlik, tapu/ikamet, riskli yapı ve IBAN belgelerini hazırlayın.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Formu kurumdan al ve doldur",
          text: "Ek-1 / Ek-2 / Ek-3 başvuru formu kurumda verilir.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Başvuruyu teslim et",
          text: "İlgili kurum birimine eksiksiz dosyayı verin; eksik evrak tebligatını takip edin.",
        },
      ],
    },
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "Kira yardımı", path: "/rehber/kira-yardimi" },
    ]),
    faqPageSchema([...FAQ]),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumbLast="Kira yardımı"
      schemas={schemas}
    >
      <p>
        <strong>Kira yardımı</strong>, 6306 sayılı kanun kapsamındaki riskli
        yapı / dönüşüm uygulamalarında hak sahiplerinin barınma sürecine katkı
        için başvurduğu destektir. Aşağıdaki evrak listeleri kurum
        uygulamalarındaki{" "}
        <strong>malik kira yardımı</strong> ile{" "}
        <strong>taşınma yardımı</strong> (konut kiracısı / iş yeri kiracısı)
        ayrımına göredir. Formlar (Ek-1, Ek-2, Ek-3){" "}
        <strong>kurumda verilir</strong>.
      </p>

      <p>
        <strong>Karıştırılmamalı:</strong> Yarısı Bizden paketindeki{" "}
        <strong>
          taşınma / tahliye desteği ({formatTRY(DESTEK_TUTARLARI.konut.tasinma)})
        </strong>{" "}
        hibe+kredi ile birlikte birim paketinde yer alır (1 konut{" "}
        {formatTRY(DESTEK_TUTARLARI.konut.toplamIlk)}, 1 iş yeri{" "}
        {formatTRY(DESTEK_TUTARLARI.ticari.toplamIlk)}). Bu sayfadaki{" "}
        <strong>kira yardımı / taşınma yardımı başvuruları</strong> ayrı evrak
        ve formlarla yürütülür. Paket tutarları için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi hesaplama
        </Link>{" "}
        sayfasına bakın.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Nasıl başvurulur?
      </h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Malik misiniz, konut kiracısı mısınız, iş yeri kiracısı mısınız?
          Buna göre Ek-1 / Ek-2 / Ek-3 yolunu seçin.
        </li>
        <li>
          Aşağıdaki listelere göre evrakları <strong>sırayla</strong>{" "}
          düzenleyin (kurum bu sırayı ister).
        </li>
        <li>
          Başvuru formunu kurumdan alın, doldurun; asıl + fotokopi istenen
          belgeleri eksiksiz teslim edin.
        </li>
        <li>
          Eksik evrak bildirimi gelirse süresinde tamamlayın; ödeme IBAN’a
          yapılır.
        </li>
      </ol>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Kira yardımı başvurusu için istenen belgeler
      </h2>
      <p className="text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Malik başvuruları</strong>
      </p>

      <BelgeListesi
        title="Malik — kira yardımı (Ek-1)"
        note="Lütfen evraklarınızı bu sıraya göre düzenleyiniz."
        items={[
          {
            baslik: "Ek-1 Başvuru Formu",
            alt: ["Kurumda verilir."],
          },
          {
            baslik: "Nüfus cüzdanı aslı ve fotokopisi",
          },
          {
            baslik:
              "Konut veya işyerinin bağımsız bölümünü gösterir tapu belgesi aslı ve fotokopisi",
            alt: [
              "Tapu arsa paylı ise: bağımsız birimin kime ait olduğunu gösterir Emlak Vergi Beyannamesi — ilgili belediyeden; yetkili birim amiri imzalı ve mühürlü; bağımsız birim numarası ve hisse oranını gösterir olmalı.",
              "Veya son 3 aya ait elektrik, su veya doğalgaz faturalarından birinin aslı — malik adına kayıtlı; açık adres ve bağımsız bölüm numarasını gösterir olmalı.",
            ],
          },
          {
            baslik: "Taşınmaza ait güncel tapu kaydı",
            alt: [
              "Yetkili birim amiri tarafından imzalanmış ve mühürlü olmalıdır.",
            ],
          },
          {
            baslik: "Adrese dayalı nüfus kayıt örneği aslı",
            alt: [
              "Nüfus Müdürlüğünden alınır; ıslak imzalı olmalıdır.",
            ],
          },
          {
            baslik:
              "Kamu bankalarına ait IBAN numarasını gösteren hesap cüzdanı fotokopisi",
            alt: [
              "Mümkün olması halinde Ziraat Bankası veya Halkbankası tercih edilir.",
            ],
          },
        ]}
      />

      <div className="card not-prose mt-3 border-l-4 border-l-[#2cb34f] p-4 text-sm text-[#374151]">
        <p className="font-bold text-[#111321]">
          Vekâletname ile başvuru yapılacak ise
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#6b7280]">
          <li>
            Vekâletnamede{" "}
            <em>
              “6306 sayılı Kanun kapsamında yapılacak kira yardımı başvurusu
              için yetki verilmesi”
            </em>{" "}
            ibaresi yer almalıdır.
          </li>
          <li>Vekâletname ile birlikte vekilin kimlik aslı ve fotokopisi.</li>
        </ul>
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Taşınma yardımı başvurusu için istenen belgeler
      </h2>

      <BelgeListesi
        title="Konut kiracıları (Ek-2)"
        note="Lütfen evraklarınızı bu sıraya göre düzenleyiniz."
        items={[
          {
            baslik: "Ek-2 Başvuru Formu",
            alt: ["Kurumda verilir."],
          },
          {
            baslik: "Nüfus cüzdanı aslı ve fotokopisi",
          },
          {
            baslik:
              "Riskli binada oturduğunu gösterir adrese dayalı nüfus kayıt örneği aslı",
            alt: [
              "Nüfus Müdürlüğünden; ıslak imzalı olmalı.",
              "Veya son 3 aya ait elektrik, su, doğalgaz faturalarından birinin aslı — kiracı adına kayıtlı; açık adres ve bağımsız bölüm numarasını gösterir olmalı.",
            ],
          },
          {
            baslik: "Yeni adrese dayalı nüfus kayıt örneği aslı",
            alt: [
              "Nüfus Müdürlüğünden alınır; ıslak imzalı olmalıdır.",
            ],
          },
          {
            baslik: "Riskli yapı belirtme yazısının fotokopisi",
          },
          {
            baslik:
              "Kamu bankalarına ait hesap numarası (IBAN) gösteren hesap cüzdanı fotokopisi",
            alt: [
              "Mümkün olması halinde Ziraat Bankası veya Halkbankası.",
            ],
          },
        ]}
      />

      <BelgeListesi
        title="İş yeri kiracıları (Ek-3)"
        note="Lütfen evraklarınızı bu sıraya göre düzenleyiniz."
        items={[
          {
            baslik: "Ek-3 Başvuru Formu",
            alt: ["Kurumda verilir."],
          },
          {
            baslik: "Nüfus cüzdanı aslı ve fotokopisi",
          },
          {
            baslik: "Riskli bina adresine ait vergi levhası",
          },
          {
            baslik: "Yeni taşınılan adrese ait vergi levhası",
          },
          {
            baslik: "Riskli yapı belirtme yazısının fotokopisi",
          },
          {
            baslik:
              "Ziraat Bankası hesap numarası (IBAN) gösteren hesap cüzdanı fotokopisi",
          },
        ]}
      />

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Pratik ipuçları
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Evrakları listedeki <strong>sıraya göre</strong> dosyalayın; eksik
          sıra veya eksik mühür/imza iade nedenidir.
        </li>
        <li>
          Faturalarda <strong>bağımsız bölüm numarası</strong> ve açık adres
          görünür olmalı.
        </li>
        <li>
          Belediye emlak beyannamesi ve tapu kayıtlarında{" "}
          <strong>imza + mühür</strong> şartına dikkat edin.
        </li>
        <li>
          Nüfus kayıt örneklerinde <strong>ıslak imza</strong> aranır.
        </li>
        <li>
          Güncel form ve ek şartlar için başvuracağınız kurum birimini arayın;
          listeler dönemsel olarak güncellenebilir.
        </li>
      </ul>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa kurum
        uygulamalarındaki belge listelerine dayalı genel bilgilendirmedir.
        Nihai evrak ve tutar için ilgili belediye / Kentsel Dönüşüm birimi
        açıklamaları esas alınır.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        6306 süreci için{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          kanun rehberi
        </Link>
        ; hibe–kredi–taşınma paket tutarları için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hesaplama sayfası
        </Link>
        . İstanbul’da müteahhit arıyorsanız{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan
        </Link>{" "}
        verebilirsiniz.
      </p>
    </RehberLayout>
  );
}
