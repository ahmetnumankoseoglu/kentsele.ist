import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  organizationSchema,
  rehberArticleSchema,
  rehberWebPageSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import { rehberArticleMetadata } from "@/lib/seo/istanbul";
import { getSiteUrl } from "@/lib/seo/site";

const PATH = "/rehber/6306-sayili-kanun";
const TITLE =
  "6306 Sayılı Kanun Nedir? İstanbul Kentsel Dönüşüm ve Riskli Yapı";
const DESCRIPTION =
  "6306 sayılı Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun: riskli yapı tespiti, malik hakları, itiraz, yıkım süreci. İstanbul kentsel dönüşüm rehberi.";
const PUBLISHED = "2026-07-01T09:00:00+03:00";
const MODIFIED = "2026-07-28T12:00:00+03:00";

export const metadata: Metadata = rehberArticleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "6306 sayılı kanun",
    "6306 kentsel dönüşüm",
    "riskli yapı kanunu İstanbul",
    "afet riski altındaki alanlar",
    "kentsel dönüşüm malik hakları",
    "İstanbul riskli yapı",
  ],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
});

const FAQ = [
  {
    q: "6306 sayılı kanun ne zaman yürürlüğe girdi?",
    a: "Kanun 16 Mayıs 2012 tarihinde kabul edilmiş, 31 Mayıs 2012 tarihli Resmî Gazete’de yayımlanarak yürürlüğe girmiştir. Sonraki yıllarda yönetmelik ve uygulama değişiklikleriyle detaylandırılmıştır.",
  },
  {
    q: "Riskli yapı tespiti zorunlu mu?",
    a: "Malikler kendi talebiyle riskli yapı tespiti yaptırabilir. Ayrıca idare (bakanlık, belediye vb.) de resen tespit yaptırabilir. Riskli yapı kararı tapuya şerh edilir ve süreç yasal takvime bağlanır.",
  },
  {
    q: "Kat maliklerinin tamamı anlaşmak zorunda mı?",
    a: "Uygulama tipine göre çoğunluk ve usuller yönetmelikle belirlenir. Pratikte mümkün olduğunca yüksek mutabakat süreci hızlandırır. Güncel oran ve usuller için yürürlükteki yönetmelik ve idare rehberleri kontrol edilmelidir.",
  },
  {
    q: "Riskli yapı kararına itiraz edilebilir mi?",
    a: "Evet. Riskli yapı tespitine karşı malikler veya kanuni temsilcileri, tebligattan itibaren kanunda/yönetmelikte öngörülen süre içinde itiraz edebilir. İtirazlar üniversiteler bünyesindeki teknik heyetlerce değerlendirilir.",
  },
  {
    q: "6306 ile kira yardımı veya hibe ilişkisi nedir?",
    a: "Kanun dönüşüm uygulamalarına zemin hazırlar; kira yardımı, hibe ve faiz destekli krediler yönetmelik ve dönemsel programlarla (ör. Yarısı Bizden) yürütülür. Detaylar için hibe-kredi ve kira yardımı rehberlerimize bakın.",
  },
  {
    q: "İstanbul’da 6306 nasıl uygulanır?",
    a: "İstanbul’da riskli yapı ve kentsel dönüşüm süreçleri ilgili belediyeler ile Kentsel Dönüşüm Başkanlığı koordinasyonunda yürür. İlçe bazlı ilan ve müteahhit eşleşmesi için kentsele.ist kullanılabilir.",
  },
] as const;

export default function Kanun6306Page() {
  const schemas = [
    websiteSchema(),
    organizationSchema(),
    rehberWebPageSchema({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
    }),
    rehberArticleSchema({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      keywords: [
        "6306 sayılı kanun",
        "İstanbul kentsel dönüşüm",
        "riskli yapı",
      ],
    }),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "6306 sayılı kanun", path: PATH },
    ]),
    faqPageSchema([...FAQ]),
    howToSchema({
      name: "İstanbul’da 6306 riskli yapı süreci adımları",
      description:
        "Riskli yapı tespitinden yeniden yapılaşmaya genel süreç adımları.",
      steps: [
        {
          name: "Tespit",
          text: "Lisanslı kurumlarla riskli yapı tespiti; malik talebi veya idare resen.",
        },
        {
          name: "İdare onayı ve tapu şerhi",
          text: "Uygun tespitler tapuya riskli yapı şerhi olarak işlenir.",
        },
        {
          name: "Tebligat ve itiraz",
          text: "Maliklere tebliğ; yasal süre içinde itiraz hakkı.",
        },
        {
          name: "Tahliye ve yıkım",
          text: "Anlaşma öncelikli olmak üzere tahliye ve yıkım takvimi.",
        },
        {
          name: "Yeniden yapım",
          text: "Kat karşılığı, hakediş veya diğer modellerle proje ve ruhsat.",
        },
      ],
    }),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumbLast="6306 sayılı kanun"
      schemas={schemas}
    >
      <p>
        <strong>6306 sayılı Kanun</strong>, resmi adıyla{" "}
        <em>
          Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun
        </em>
        , Türkiye’de deprem ve diğer afet risklerine karşı yapı stokunun
        yenilenmesini amaçlayan temel mevzuattır. Günlük dilde çoğu zaman
        “kentsel dönüşüm kanunu” olarak anılır. Amacı; can ve mal güvenliğini
        tehdit eden yapıların tespit edilmesi, gerektiğinde yıktırılması ve
        yerinde veya alternatif alanlarda sağlıklı, yaşanabilir yapılaşmanın
        sağlanmasıdır. <strong>İstanbul</strong>’da yoğun yapı stoku nedeniyle
        bu kanun uygulamaları özel önem taşır.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Kanun neyi düzenler?
      </h2>
      <p>
        6306 sayılı Kanun üç ana uygulama alanını çerçeveler:{" "}
        <strong>riskli yapı</strong>, <strong>riskli alan</strong> ve{" "}
        <strong>rezerv yapı alanı</strong>. Riskli yapı, deprem başta olmak
        üzere afet riski taşıdığı teknik tespitlerle ortaya konan bağımsız
        yapıları ifade eder. Riskli alan, imar ve planlama bütünlüğü içinde
        toplu dönüşüm gerektiren bölgeleri; rezerv yapı alanı ise yeniden
        yerleşim ve uygulama ihtiyacı için belirlenen alanları kapsar.
      </p>
      <p>
        Kanun; tespit, tebligat, itiraz, tahliye ve yıkım takvimi, maliklerin
        karar alma usulleri, payların satışı, anlaşma ve uygulama modelleri
        gibi konuları düzenler. Uygulama ayrıntıları büyük ölçüde{" "}
        <strong>yönetmelik</strong> ve idare (Çevre, Şehircilik ve İklim
        Değişikliği Bakanlığı / Kentsel Dönüşüm Başkanlığı, belediyeler)
        uygulamalarıyla şekillenir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Riskli yapı süreci nasıl işler?
      </h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          <strong>Tespit:</strong> Malik talebiyle veya idare resen; bakanlıkça
          lisanslı kurum/kuruluşlarca riskli yapı tespiti yapılır.
        </li>
        <li>
          <strong>İdare onayı ve tapu şerhi:</strong> Uygun bulunan tespitler
          ilgili tapu müdürlüğüne bildirilir; riskli yapı şerhi işlenir.
        </li>
        <li>
          <strong>Tebligat ve itiraz:</strong> Maliklere tebliğ edilir. Kanuni
          süre içinde itiraz hakkı vardır.
        </li>
        <li>
          <strong>Tahliye ve yıkım:</strong> Süreç tamamlandıktan sonra tahliye
          ve yıkım takvimi işler. Anlaşma yolu önceliklidir.
        </li>
        <li>
          <strong>Yeniden yapım:</strong> Malikler müteahhit ile kat karşılığı,
          hakediş veya diğer modellerle yeniden yapılaşma yoluna gidebilir;
          idari izin ve ruhsat süreçleri devreye girer.
        </li>
      </ol>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        İstanbul malikleri için pratik anlamı
      </h2>
      <p>
        6306, maliklere hem <strong>güvenli yapı</strong> imkânı hem de süreç
        disiplini getirir. Riskli yapı kararı sonrası belirsizlik azalır; ancak
        malikler arasında mutabakat, proje modeli ve müteahhit seçimi kritik
        hâle gelir. Yanlış sözleşme, eksik teminat veya belirsiz teslim
        koşulları mağduriyet riskini artırır.
      </p>
      <p>
        kentsele.ist üzerinde malikler İstanbul ilçelerine özel{" "}
        <strong>ücretsiz ilan</strong> oluşturabilir; iletişim bilgileri
        yalnızca <strong>onaylı müteahhit</strong> hesaplarına açılır.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Ne işe yarar? (özet)
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Afet riski taşıyan yapıların yasal çerçevede tespitini sağlar.</li>
        <li>
          Dönüşüm uygulamalarında usul, süre ve malik–idare ilişkilerini
          düzenler.
        </li>
        <li>
          Anlaşma öncelikli olmak üzere yeniden yapılaşma ve uygulama araçlarını
          tanımlar.
        </li>
        <li>
          Kira yardımı, kredi ve hibe gibi destek programlarının dayandığı
          yasal zeminle ilişkilidir.
        </li>
      </ul>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa genel
        bilgilendirmedir; hukuki danışmanlık yerine geçmez. Kanun maddeleri,
        yönetmelik ve idare uygulamaları güncellenebilir. Karar öncesi güncel
        mevzuat metni ve yetkili kurumlar ile doğrulama yapılmalıdır.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        Hibe, kredi ve taşınma tutarları için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi hesaplama
        </Link>
        ; kira/taşınma evrakları için{" "}
        <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
          kira yardımı
        </Link>{" "}
        rehberine bakın. İstanbul’da dönüşüm ilanı:{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan formu
        </Link>
        .
      </p>
    </RehberLayout>
  );
}
