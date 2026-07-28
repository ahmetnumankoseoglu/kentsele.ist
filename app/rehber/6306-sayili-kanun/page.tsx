import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

const TITLE = "6306 sayılı kanun nedir? Ne işe yarar?";
const DESCRIPTION =
  "6306 sayılı Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun: riskli yapı, riskli alan, malik kararları, yıkım ve kentsel dönüşüm süreci.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "6306 sayılı kanun",
    "6306 kentsel dönüşüm",
    "riskli yapı kanunu",
    "afet riski altındaki alanlar",
    "kentsel dönüşüm malik hakları",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "tr_TR",
  },
  alternates: {
    canonical: `${getSiteUrl()}/rehber/6306-sayili-kanun`,
  },
};

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
    a: "Uygulama tipine göre çoğunluk ve usuller yönetmelikle belirlenir. Pratikte mümkün olduğunca yüksek mutabakat (ideal olarak tam uzlaşı) süreci hızlandırır ve uyuşmazlık riskini azaltır. Güncel oran ve usuller için yürürlükteki yönetmelik ve idare rehberleri kontrol edilmelidir.",
  },
  {
    q: "Riskli yapı kararına itiraz edilebilir mi?",
    a: "Evet. Riskli yapı tespitine karşı malikler veya kanuni temsilcileri, tebligattan itibaren kanunda/yönetmelikte öngörülen süre içinde itiraz edebilir. İtirazlar üniversiteler bünyesindeki teknik heyetlerce değerlendirilir.",
  },
  {
    q: "6306 ile kira yardımı veya hibe ilişkisi nedir?",
    a: "Kanun dönüşüm uygulamalarına zemin hazırlar; kira yardımı, hibe ve faiz destekli krediler ise ilgili yönetmelikler ve dönemsel destek programlarıyla (ör. kira yardımı, yapım kredisi/hibe paketleri) yürütülür. Detaylar için hibe-kredi rehberimize bakın.",
  },
] as const;

export default function Kanun6306Page() {
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
      mainEntityOfPage: `${getSiteUrl()}/rehber/6306-sayili-kanun`,
    },
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "6306 sayılı kanun", path: "/rehber/6306-sayili-kanun" },
    ]),
    faqPageSchema([...FAQ]),
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
        sağlanmasıdır.
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
          <strong>Tebligat ve itiraz:</strong> Maliklere tebliğ edilir.
          Kanuni süre içinde itiraz hakkı vardır.
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
        Malikler için pratik anlamı
      </h2>
      <p>
        6306, maliklere hem <strong>güvenli yapı</strong> imkânı hem de süreç
        disiplini getirir. Riskli yapı kararı sonrası belirsizlik azalır;
        ancak malikler arasında mutabakat, proje modeli ve müteahhit seçimi
        kritik hâle gelir. Yanlış sözleşme, eksik teminat veya belirsiz teslim
        koşulları mağduriyet riskini artırır.
      </p>
      <p>
        Bu nedenle süreçte; risk raporunu anlamak, malik kararlarını belgelemek,
        birden fazla müteahhit teklifini karşılaştırmak ve yazılı sözleşme
        şartlarını netleştirmek esastır. kentsele.ist üzerinde malikler
        İstanbul ilçelerine özel <strong>ücretsiz ilan</strong> oluşturabilir;
        iletişim bilgileri yalnızca <strong>onaylı müteahhit</strong>{" "}
        hesaplarına açılır.
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
          Anlaşma öncelikli olmak üzere yeniden yapılaşma ve uygulama
          araçlarını tanımlar.
        </li>
        <li>
          Kira yardımı, kredi ve hibe gibi destek programlarının dayandığı
          yasal zeminle ilişkilidir (destek tutarları ayrı düzenlemelerle
          belirlenir).
        </li>
      </ul>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa genel
        bilgilendirmedir; hukuki danışmanlık yerine geçmez. Kanun maddeleri,
        yönetmelik ve idare uygulamaları güncellenebilir. Karar öncesi güncel
        mevzuat metni ve yetkili kurumlar (ilgili bakanlık, belediye, lisanslı
        tespit kuruluşu, avukat) ile doğrulama yapılmalıdır.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        Hibe, kira yardımı ve kredi tutarları için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi hesaplama rehberine
        </Link>{" "}
        göz atın. İstanbul’da dönüşüm ilanı vermek için{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan formunu
        </Link>{" "}
        kullanabilirsiniz.
      </p>
    </RehberLayout>
  );
}
