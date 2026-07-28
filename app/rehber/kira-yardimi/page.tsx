import type { Metadata } from "next";
import Link from "next/link";
import { RehberLayout } from "@/components/rehber/RehberLayout";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site";

const TITLE = "Kentsel dönüşüm kira yardımı nedir? Nasıl alınır?";
const DESCRIPTION =
  "Kentsel dönüşüm kira yardımı nedir, kimler yararlanır, nasıl başvurulur, hangi belgeler gerekir? 6306 kapsamı ve pratik adımlar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "kentsel dönüşüm kira yardımı",
    "kira yardımı nasıl alınır",
    "kira yardımı başvuru",
    "6306 kira yardımı",
    "riskli yapı kira yardımı",
    "İstanbul kira yardımı",
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
    q: "Kira yardımı nedir?",
    a: "Riskli yapı veya dönüşüm uygulaması nedeniyle konutunu tahliye etmek zorunda kalan hak sahiplerine, belirli süreyle ödenen aylık nakdi destektir. Amaç, yeniden yapım sürecinde barınma maliyetine katkı sağlamaktır.",
  },
  {
    q: "Kimler kira yardımından yararlanabilir?",
    a: "Genellikle riskli yapı tespitine konu taşınmazda, kayıt tarihinde tapuda malik görünen ve fiilen ikamet eden hak sahipleri (şartlara göre) başvurabilir. Kiracılar için ayrı usuller program ve yönetmeliğe göre değişebilir. Güncel şartlar resmî kurumdan teyit edilmelidir.",
  },
  {
    q: "Başvuru nereye yapılır?",
    a: "Uygulamaya göre ilgili belediye, il müdürlüğü veya Kentsel Dönüşüm Başkanlığı / bakanlık e-hizmet kanalları üzerinden yapılır. İstanbul’da çoğu dosya belediye kentsel dönüşüm birimleri ve e-Devlet bağlantılı süreçlerle ilerler.",
  },
  {
    q: "Hangi belgeler istenir?",
    a: "Kimlik, tapu/hisse belgesi, riskli yapı tespiti ve tebligat evrakları, ikametgâh, banka IBAN’ı, varsa vekâletname sık istenir. Liste dosyaya ve döneme göre değişir.",
  },
  {
    q: "Kira yardımı hibe ve krediden farklı mı?",
    a: "Evet. Hibe ve kredi çoğunlukla yapım / finansman paketidir; kira yardımı tahliye sürecinde barınma desteğidir. Ayrı başvuru ve ayrı şartları olabilir.",
  },
  {
    q: "Ne kadar süre ödenir?",
    a: "Süre yönetmelik ve dönemsel uygulamaya göre belirlenir (ör. belirli ay sayısı). Süre uzatımı veya kesinti şartları resmî duyurulara bağlıdır.",
  },
] as const;

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
        "Riskli yapı kapsamında kira yardımı için genel başvuru adımları.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Riskli yapı / dönüşüm statüsünü doğrula",
          text: "Tapu şerhi, riskli yapı raporu ve tebligatları toplayın.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Hak sahipliğini netleştir",
          text: "Malik, hisse ve ikamet durumunu belgelerle kanıtlayın.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Başvuru kanalını seç",
          text: "İlgili belediye veya e-Devlet / başkanlık kanalından başvurun.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Belgeleri yükle / teslim et",
          text: "Kimlik, tapu, IBAN, ikametgâh ve istenen ekleri tamamlayın.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Onay ve ödeme takibi",
          text: "Başvuru sonucunu takip edin; eksik evrak tebligatlarını tamamlayın.",
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
        <strong>Kentsel dönüşüm kira yardımı</strong>, 6306 sayılı kanun
        kapsamındaki uygulamalarda konutunu tahliye etmek zorunda kalan hak
        sahiplerine, yeniden yapım sürecinde barınma giderlerine katkı için
        ödenen <strong>aylık nakdi destek</strong>tir. Hibe ve krediden ayrı bir
        kalemdir; amaç inşaat bitene kadar geçici barınmayı kolaylaştırmaktır.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Kira yardımı ne işe yarar?
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Tahliye sonrası kira maliyetine dönemsel katkı sağlar.</li>
        <li>
          Dönüşüm projesinin finansmanını (hibe/kredi) barınma nakit akışından
          ayırır.
        </li>
        <li>
          Maliklerin süreci sürdürülebilir şekilde takip etmesine yardımcı
          olur.
        </li>
      </ul>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Kimler yararlanabilir? (genel çerçeve)
      </h2>
      <p>
        Uygulama ayrıntıları yönetmelik ve dönemsel programlara göre değişir.
        Genel olarak şu profil sık öne çıkar:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Riskli yapı tespitine konu taşınmazda, kayıt tarihinde{" "}
          <strong>tapuda malik</strong> görünen kişi
        </li>
        <li>
          Fiilen <strong>ikamet</strong> eden hak sahibi (ikamet şartı program
          bazında aranabilir)
        </li>
        <li>
          Başvuru belgelerini eksiksiz sunan ve idarece hak sahibi kabul edilen
          kişiler
        </li>
      </ul>
      <p>
        Kiracı, birden fazla konut, hisseli tapu ve vekâletli başvurular özel
        dosya incelenir. Nihai karar yetkili idareye aittir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Nasıl alınır? Adım adım başvuru
      </h2>
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <strong>Riskli yapı / dönüşüm dosyasını hazırlayın.</strong> Tespit
          raporu, idare kararı, tapu şerhi ve tebligatları toplayın. 6306 süreci
          için{" "}
          <Link
            href="/rehber/6306-sayili-kanun"
            className="font-bold text-[#168f43]"
          >
            kanun rehberine
          </Link>{" "}
          bakabilirsiniz.
        </li>
        <li>
          <strong>Hak sahipliğini belgelendirin.</strong> Kimlik, tapu/hisse,
          varsa veraset veya vekâlet, ikametgâh belgesi.
        </li>
        <li>
          <strong>Başvuru kanalını kullanın.</strong> İlgili belediyenin kentsel
          dönüşüm birimi, e-Devlet üzerinden sunulan hizmetler veya Kentsel
          Dönüşüm Başkanlığı / bakanlık duyurularındaki başvuru ekranları.
        </li>
        <li>
          <strong>IBAN ve iletişim bilgilerini girin.</strong> Ödemeler genelde
          hak sahibi adına banka hesabına yapılır.
        </li>
        <li>
          <strong>Sonuç ve ödemeyi takip edin.</strong> Eksik evrak bildirimi
          gelirse süresinde tamamlayın. Ödeme ayı ve tutar program kurallarına
          göredir.
        </li>
      </ol>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sık istenen belgeler
      </h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>T.C. kimlik belgesi</li>
        <li>Tapu kaydı / hisse belgesi</li>
        <li>Riskli yapı tespit ve tebligat evrakları</li>
        <li>İkametgâh / yerleşim yeri belgesi</li>
        <li>Banka hesap bilgisi (IBAN)</li>
        <li>Vekâletname (başvuru vekille yapılıyorsa)</li>
        <li>Gerekirse nüfus / veraset belgeleri</li>
      </ul>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Dikkat edilmesi gerekenler
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Kira yardımı tutarı ve süresi <strong>dönemsel</strong>dir; sabit
          “her zaman aynı rakam” varsaymayın.
        </li>
        <li>
          Tapu kayıt tarihi, ikamet ve fiilî kullanım idarece kontrol edilir.
        </li>
        <li>
          Yanlış beyan veya eksik belge başvuruyu geciktirir veya reddettirir.
        </li>
        <li>
          Hibe/kredi paketi ile kira yardımı <strong>aynı başvuru formu</strong>{" "}
          olmayabilir; ayrı süreçleri takip edin. Hibe-kredi için{" "}
          <Link
            href="/rehber/hibe-ve-kredi-hesaplama"
            className="font-bold text-[#168f43]"
          >
            hesaplama rehberine
          </Link>{" "}
          bakın.
        </li>
      </ul>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa genel
        bilgilendirmedir. Başvuru şartları, tutarlar ve süreler resmî mevzuat ve
        kurum duyurularına göre değişir. Güncel bilgi için yetkili belediye /
        Kentsel Dönüşüm Başkanlığı / e-Devlet kanallarını kullanın.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        İstanbul’da dönüşüm sürecinde müteahhit arıyorsanız{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan
        </Link>{" "}
        oluşturabilirsiniz. İlan vermek kayıtsızdır; düzenleme için hesap
        gerekir. Malik numarası yalnızca onaylı müteahhitlere açılır.
      </p>
    </RehberLayout>
  );
}
