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
import { DESTEK_TUTARLARI, formatTRY } from "@/lib/content/destek-tutarlari";
import { IBB_KIRA_DESTEGI } from "@/lib/content/ibb-kira-destegi";

const PATH = "/rehber/kira-yardimi";
const TITLE = "İstanbul kira ve taşınma yardımı | İBB ve bakanlık";
const DESCRIPTION =
  "İBB hızlı tarama / güçlendirme tutarları, riskli alan kira ve taşınma özeti, başvuru evrak listesi.";
const PUBLISHED = "2026-07-01T09:00:00+03:00";
const MODIFIED = "2026-07-29T12:00:00+03:00";

const IBB = IBB_KIRA_DESTEGI;
const T125 = DESTEK_TUTARLARI.konut.tasinma;

export const metadata: Metadata = rehberArticleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "kira yardımı",
    "İBB",
    "taşınma yardımı",
    "evrak",
    "İstanbul",
  ],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
});

const FAQ = [
  {
    q: "Aylık kira yardımı ile 125.000 TL taşınma aynı anda alınır mı?",
    a: `Uygulamada ilçe belediyeleri sıklıkla “ya aylık kira yardımı ya da tek seferlik ${formatTRY(T125)} taşınma/tahliye” şeklinde yönlendirir; her iki kalemi aynı dosyada birleştirmek her zaman mümkün olmayabilir. Yarısı Bizden’deki ${formatTRY(T125)} taşınma, hibe+kredi paketinin parçasıdır ve ayrı süreçtedir. Nihai seçenek ve birleştirme kuralları için başvuracağınız ilçe kentsel dönüşüm / kira yardım birimine sorun.`,
  },
  {
    q: "İBB kira desteği Bakanlık yardımının yerine mi geçer?",
    a: "Hayır. İBB, Hızlı Tarama D–E ve güçlendirme kapsamında Çevre, Şehircilik ve İklim Değişikliği Bakanlığı kira yardımına ek (ilave) destek verir. Riskli/rezerv alanlarda ise İBB yetkisindeki alanlara özel tutarlar uygulanır.",
  },
  {
    q: "Hızlı tarama D–E şartı nedir?",
    a: "İBB’nin hızlı tarama yöntemiyle D veya E risk sınıfına giren öncelikli yapılarda, 6306 kapsamında lisanslı kuruluşla riskli yapı tespiti, tahliye ve yıkım (veya güçlendirmede ruhsat) sonrası süreç ilerler. Bakanlık kira onayından veya İBB’ye dilekçeden sonra İBB ödemesi başlar.",
  },
  {
    q: "Güçlendirme yapılan binada da İBB kira yardımı var mı?",
    a: "Evet. Mart ayı İBB Meclis kararıyla; hızlı tarama yapılmış, statik açıdan birlikte güçlendirilecek ve TBDY’ye uygun güçlendirme ruhsatı/izin belgesi alınan binalarda da riskli yapılarla aynı İBB kira tutarları uygulanır (18 aya / 12 aya kadar).",
  },
  {
    q: "Malik başvurusunda hangi form kullanılır?",
    a: "Malik kira yardımı başvurularında genelde Ek-1 Başvuru Formu kullanılır; form kurumda verilir.",
  },
  {
    q: "Konut kiracısı ve iş yeri kiracısı aynı belgeleri mi verir?",
    a: "Hayır. Konut kiracıları Ek-2; iş yeri kiracıları Ek-3 formunu kullanır. Konut kiracısında adrese dayalı nüfus kaydı / fatura; iş yeri kiracısında vergi levhası (eski ve yeni adres) istenir.",
  },
  {
    q: "IBAN hangi bankadan olmalı?",
    a: "Kamu bankalarına ait IBAN gösteren hesap cüzdanı fotokopisi istenir. Mümkünse Ziraat Bankası veya Halkbankası tercih edilir. İş yeri kiracılarında listede Ziraat Bankası IBAN vurgulanır.",
  },
] as const;

function TutarTablosu({
  title,
  rows,
}: {
  title: string;
  rows: { kim: string; tutar: string; sure: string }[];
}) {
  return (
    <div className="card not-prose mt-3 overflow-hidden">
      <p className="border-b border-[#e3e4e6] bg-[#f8f8f8] px-4 py-2.5 text-sm font-bold text-[#111321]">
        {title}
      </p>
      <div className="divide-y divide-[#f0f0f0]">
        {rows.map((r) => (
          <div
            key={r.kim}
            className="grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-3 sm:gap-2"
          >
            <span className="font-semibold text-[#111321]">{r.kim}</span>
            <span className="tabular-nums text-[#168f43] sm:text-center">
              {r.tutar}
            </span>
            <span className="text-[#6b7280] sm:text-right">{r.sure}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        "kira yardımı",
        "İBB kira yardımı",
        "hızlı tarama",
        "İstanbul",
      ],
    }),
    howToSchema({
      name: "İstanbul İBB / Bakanlık kira yardımı başvurusu",
      description:
        "Riskli yapı veya güçlendirme sonrası kira desteği için genel adımlar.",
      steps: [
        {
          name: "Hızlı tarama / riskli yapı tespiti",
          text: "Gerekliyse İBB hızlı tarama; 6306 kapsamında lisanslı kuruluşla riskli yapı tespiti.",
        },
        {
          name: "Tahliye, yıkım veya güçlendirme ruhsatı",
          text: "Yıkım senaryosunda tahliye-yıkım; güçlendirmede TBDY uygun ruhsat/izin belgesi.",
        },
        {
          name: "Bakanlık / ilçe belediyesi kira onayı",
          text: "ÇŞB ilçe belediyeleri üzerinden kira yardımına onay veya İBB’ye dilekçe.",
        },
        {
          name: "Evrak ve ödeme",
          text: "Ek-1/2/3 ve istenen belgelerle dosya; IBAN’a ödeme. İBB ilave desteği onay sonrası başlar.",
        },
      ],
    }),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "Kira yardımı", path: PATH },
    ]),
    faqPageSchema([...FAQ]),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumbLast="Kira yardımı"
      schemas={schemas}
    >
      <p>
        İstanbul’da kentsel dönüşüm kira desteği tek bir kalem değildir.{" "}
        <strong>Bakanlık (ÇŞB)</strong> kira yardımı,{" "}
        <strong>İBB ilave kira desteği</strong> ve{" "}
        <strong>Yarısı Bizden tek seferlik taşınma</strong> (
        {formatTRY(T125)}) farklı programlardır. Belediyede duyduğunuz “ya
        aylık alın ya da {formatTRY(T125)} tek seferlik” yönlendirmesi bu
        ayrımı yansıtır; dosyanızda hangisinin uygulanacağı kurum uygulamasına
        bağlıdır.
      </p>

      <div className="card not-prose mt-4 border-l-4 border-l-[#ee401d] bg-[#fef2f2] p-4 text-sm text-[#374151]">
        <p className="font-bold text-[#111321]">
          Pratik not (belediye uygulaması)
        </p>
        <p className="mt-1.5 text-[#6b7280]">
          Birçok ilçede hak sahibine{" "}
          <strong className="text-[#111321]">aylık kira yardımı</strong> ile{" "}
          <strong className="text-[#111321]">
            tek seferlik {formatTRY(T125)} taşınma/tahliye
          </strong>{" "}
          arasında seçim yaptırıldığı görülür; ikisini aynı anda “otomatik”
          vermezler. Yarısı Bizden hibe+kredi paketindeki taşınma kalemi de ayrı
          kampanya sürecindedir. Karar vermeden önce ilçe kentsel dönüşüm /
          kira yardım birimine hangi yolu seçeceğinizi netleştirin.
        </p>
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        İBB kira desteği (güncel tutarlar)
      </h2>
      <p>
        İBB, 2023’te başlattığı kira yardımlarının kapsamını{" "}
        <strong>12.11.2025 tarih ve 1277 sayılı Meclis Kararı</strong> ile
        genişletti. Hızlı tarama <strong>D ve E</strong> sınıfı öncelikli
        yapılar ile (Mart kararıyla) <strong>güçlendirme ruhsatı</strong> alan
        binalarda destek, Bakanlık kira yardımına{" "}
        <strong>ek</strong> olarak verilir. Resmî sayfa:{" "}
        <a
          href={IBB.resmiUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-bold text-[#168f43]"
        >
          kentseldonusum.ibb.istanbul
        </a>
        .
      </p>

      <TutarTablosu
        title={`${IBB.hizliTaramaDE.baslik} — yıkım sonrası`}
        rows={[
          {
            kim: "İkamet eden malik",
            tutar: `${formatTRY(IBB.hizliTaramaDE.malikIkamet.aylik)} / ay (emekli ${formatTRY(IBB.hizliTaramaDE.malikIkamet.emekli)})`,
            sure: `${IBB.hizliTaramaDE.malikIkamet.ay} ay`,
          },
          {
            kim: "İkamet etmeyen malik",
            tutar: `${formatTRY(IBB.hizliTaramaDE.malikIkametEtmeyen.aylik)} / ay`,
            sure: `${IBB.hizliTaramaDE.malikIkametEtmeyen.ay} ay`,
          },
          {
            kim: "Kiracı",
            tutar: `${formatTRY(IBB.hizliTaramaDE.kiraci.aylik)} / ay (emekli ${formatTRY(IBB.hizliTaramaDE.kiraci.emekli)})`,
            sure: `${IBB.hizliTaramaDE.kiraci.ay} ay`,
          },
        ]}
      />

      <TutarTablosu
        title={`${IBB.guclendirme.baslik}`}
        rows={[
          {
            kim: "İkamet eden malik",
            tutar: `${formatTRY(IBB.guclendirme.malikIkamet.aylik)} / ay (emekli ${formatTRY(IBB.guclendirme.malikIkamet.emekli)})`,
            sure: `${IBB.guclendirme.malikIkamet.ay} aya kadar`,
          },
          {
            kim: "İkamet etmeyen malik",
            tutar: `${formatTRY(IBB.guclendirme.malikIkametEtmeyen.aylik)} / ay`,
            sure: `${IBB.guclendirme.malikIkametEtmeyen.ay} aya kadar`,
          },
          {
            kim: "Kiracı",
            tutar: `${formatTRY(IBB.guclendirme.kiraci.aylik)} / ay (emekli ${formatTRY(IBB.guclendirme.kiraci.emekli)})`,
            sure: `${IBB.guclendirme.kiraci.ay} aya kadar`,
          },
        ]}
      />

      <TutarTablosu
        title={IBB.riskliRezervAlan.baslik}
        rows={[
          {
            kim: "Yapı maliki",
            tutar: `${formatTRY(IBB.riskliRezervAlan.malik.aylik)} / ay (emekli ${formatTRY(IBB.riskliRezervAlan.malik.emekli)})`,
            sure: `${IBB.riskliRezervAlan.malik.ay} aya kadar`,
          },
          {
            kim: "Kiracı",
            tutar: `${formatTRY(IBB.riskliRezervAlan.kiraci.aylik)} / ay (emekli ${formatTRY(IBB.riskliRezervAlan.kiraci.emekli)})`,
            sure: `${IBB.riskliRezervAlan.kiraci.ay} aya kadar`,
          },
        ]}
      />

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        İBB desteğinden nasıl yararlanılır?
      </h2>
      <h3 className="!mt-4 text-sm font-bold text-[#111321]">
        Yıkılıp yeniden yapılacak binalar
      </h3>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Hızlı tarama ile <strong>D veya E</strong> risk sınıfı öncelikli yapı.
        </li>
        <li>
          6306 kapsamında lisanslı kuruluşla <strong>riskli yapı tespiti</strong>
          ; ardından tahliye ve yıkım.
        </li>
        <li>
          ÇŞB’nin ilçe belediyeleri üzerinden kira yardımına{" "}
          <strong>onay vermesi</strong> veya <strong>İBB’ye dilekçe</strong> ile
          başvuru → İBB kira yardımı başlar.
        </li>
      </ol>
      <h3 className="!mt-4 text-sm font-bold text-[#111321]">
        Güçlendirme yapılacak binalar
      </h3>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Hızlı tarama; statik açıdan birlikte güçlendirilecek yapı.</li>
        <li>
          <strong>Türkiye Bina Deprem Yönetmeliği</strong>’ne uygun güçlendirme
          ruhsatı / izin belgesi.
        </li>
        <li>
          ÇŞB ilçe onayı veya İBB dilekçesi sonrası İBB kira yardımı başlar.
        </li>
      </ol>
      <p className="text-sm text-[#6b7280]">
        İBB iletişim: {IBB.iletisim.telefon} ·{" "}
        <a
          href={`mailto:${IBB.iletisim.email}`}
          className="font-semibold text-[#168f43]"
        >
          {IBB.iletisim.email}
        </a>
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Bakanlık / ilçe belediyesi kira ve taşınma evrakları
      </h2>
      <p>
        Aşağıdaki listeler kurum uygulamalarındaki{" "}
        <strong>malik kira yardımı (Ek-1)</strong> ile{" "}
        <strong>taşınma yardımı</strong> (konut kiracısı Ek-2 / iş yeri
        kiracısı Ek-3) ayrımına göredir. Formlar{" "}
        <strong>kurumda verilir</strong>.
      </p>

      <h3 className="!mt-6 text-sm font-bold text-[#111321]">
        Malik — kira yardımı (Ek-1)
      </h3>
      <BelgeListesi
        title="İstenen belgeler"
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
            alt: ["Nüfus Müdürlüğünden alınır; ıslak imzalı olmalıdır."],
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

      <h3 className="!mt-6 text-sm font-bold text-[#111321]">
        Taşınma yardımı — konut kiracıları (Ek-2)
      </h3>
      <BelgeListesi
        title="İstenen belgeler"
        note="Lütfen evraklarınızı bu sıraya göre düzenleyiniz."
        items={[
          {
            baslik: "Ek-2 Başvuru Formu",
            alt: ["Kurumda verilir."],
          },
          { baslik: "Nüfus cüzdanı aslı ve fotokopisi" },
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
            alt: ["Nüfus Müdürlüğünden alınır; ıslak imzalı olmalıdır."],
          },
          { baslik: "Riskli yapı belirtme yazısının fotokopisi" },
          {
            baslik:
              "Kamu bankalarına ait hesap numarası (IBAN) gösteren hesap cüzdanı fotokopisi",
            alt: ["Mümkün olması halinde Ziraat Bankası veya Halkbankası."],
          },
        ]}
      />

      <h3 className="!mt-6 text-sm font-bold text-[#111321]">
        Taşınma yardımı — iş yeri kiracıları (Ek-3)
      </h3>
      <BelgeListesi
        title="İstenen belgeler"
        note="Lütfen evraklarınızı bu sıraya göre düzenleyiniz."
        items={[
          {
            baslik: "Ek-3 Başvuru Formu",
            alt: ["Kurumda verilir."],
          },
          { baslik: "Nüfus cüzdanı aslı ve fotokopisi" },
          { baslik: "Riskli bina adresine ait vergi levhası" },
          { baslik: "Yeni taşınılan adrese ait vergi levhası" },
          { baslik: "Riskli yapı belirtme yazısının fotokopisi" },
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
          mühür/imza iade nedenidir.
        </li>
        <li>
          Faturalarda <strong>bağımsız bölüm numarası</strong> ve açık adres
          görünür olmalı.
        </li>
        <li>
          İBB ilave desteği için hızlı tarama D–E veya güçlendirme ruhsatı
          şartlarını kontrol edin; her riskli yapı otomatik İBB kapsamında
          değildir.
        </li>
        <li>
          Güncel form ve tutar için ilçe birimi + İBB (
          {IBB.iletisim.telefon}) ile doğrulayın.
        </li>
      </ul>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa İBB resmî
        bilgilendirmesi ve kurum belge listelerine dayalı genel
        bilgilendirmedir; hukuki danışmanlık değildir. Tutar, süre ve
        birleştirme kuralları Meclis kararı / yönetmelik ile değişebilir.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        Yarısı Bizden hibe ve kredi paket tutarları için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi hesaplama
        </Link>
        ; 6306 süreci için{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          kanun rehberi
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
