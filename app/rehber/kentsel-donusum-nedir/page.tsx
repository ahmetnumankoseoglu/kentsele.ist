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

const PATH = "/rehber/kentsel-donusum-nedir";
const TITLE = "Kentsel Dönüşüm Nedir? Amaç, Süreç ve Malik Hakları | İstanbul";
const DESCRIPTION =
  "Kentsel dönüşüm nedir, amacı nedir, mülkiyet hakkı, riskli yapı ve riskli alan farkı, itiraz, tahliye, 2/3 çoğunluk, vergi muafiyeti. İstanbul odaklı bilgilendirme rehberi.";
const PUBLISHED = "2026-07-28T10:00:00+03:00";
const MODIFIED = "2026-07-28T22:00:00+03:00";

export const metadata: Metadata = rehberArticleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "kentsel dönüşüm nedir",
    "kentsel dönüşüm amacı",
    "riskli yapı nedir",
    "riskli alan nedir",
    "kentsel dönüşüm malik hakları",
    "riskli yapı itiraz 15 gün",
    "kentsel dönüşüm vergi muafiyeti",
    "İstanbul kentsel dönüşüm",
  ],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
});

const FAQ = [
  {
    q: "Kentsel dönüşüm nedir?",
    a: "6306 sayılı Kanun’un 1. maddesine göre; afet riski taşıyan bölgeler ile bu alanların dışındaki riskli yapıların bulunduğu arsa ve arazilerde, fen ve sanat kurallarına uygun, sağlıklı ve güvenli yaşam alanları oluşturmak amacıyla iyileştirme, yenileme ve yeniden yapılandırma yapılmasıdır.",
  },
  {
    q: "5393 sayılı Belediye Kanunu ile 6306 farkı nedir?",
    a: "Belediye Kanunu m.73’teki kentsel dönüşüm ve gelişim alanı uygulamaları belediye öncülüğündedir. 6306’da süreç öncelikle hak sahipleri / malikler tarafından başlatılır; riskli yapı tespiti ve malik kararı merkezdedir.",
  },
  {
    q: "Riskli alan ile riskli yapı aynı mı?",
    a: "Hayır. Riskli alan, zemin veya yapılaşma nedeniyle can/mal kaybı riski taşıyan bölgedir ve üst idare kararıyla belirlenir. Riskli yapı, tek bir yapının teknik tespitidir. Riskli alan içindeki her yapı için uygulamada ayrı riskli yapı tespiti gerekebilir; idare uygulamasını kontrol edin.",
  },
  {
    q: "Riskli yapı tespitini kim talep eder? Tüm maliklerin onayı gerekir mi?",
    a: "Kanun ve yönetmeliğe göre yapı maliki veya yasal temsilcisi lisanslı kuruluşa başvurur. Uygulamada sıklıkla tek malik başvurusu kabul edilir; paylı mülkiyette hakların birlikte kullanımı tartışmalı olabilir. Güncel yönetmelik ve idare uygulaması esas alınmalıdır.",
  },
  {
    q: "Tespit sonrası itiraz süresi nedir? Kim inceler?",
    a: "Malikler veya yasal temsilcileri, tebliğ / muhtarlık ilanı usulüne göre tebliğ sayıldığı tarihten itibaren genellikle 15 gün içinde Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü’ne (veya yetki devri yapılmış belediyeye) yazılı itiraz edebilir. İtirazlar üniversite ve bakanlık/başkanlık personelinden oluşan teknik heyetçe incelenir.",
  },
  {
    q: "Anlaşamayan maliklerde ne olur?",
    a: "Riskli yapıda yeniden yapım için arsa payı oranında en az üçte iki (salt) çoğunlukla karar alınabilir. Karara katılmayanların hisseleri, kanundaki usulle açık artırma vb. yollarla satılarak süreç ilerletilebilir. Detaylar 6306 ve uygulama yönetmeliğine tabidir.",
  },
  {
    q: "Riskli yapı tespiti öncesi müteahhitle sözleşme geçerli midir?",
    a: "Riskli yapı tespiti yapılmadan önce müteahhitle yapılan sözleşmeler 6306 usulüne otomatik bağlanmaz; özel hukuk çerçevesinde değerlendirilir. Dönüşüm sürecindeki bağlayıcılık, tespit ve malik kararlarından sonra şekillenir.",
  },
  {
    q: "Yıkılan binanın yerine mutlaka yeni bina yapılmak zorunda mı?",
    a: "Hayır. En az üçte iki çoğunlukla alınan karara göre, yıkılan binanın yerine yeniden bina yapma zorunluluğu bulunmayabilir; malikler kararıyla farklı bir uygulama modeli de gündeme gelebilir.",
  },
  {
    q: "Elektrik, su ve doğalgaz kesilir mi?",
    a: "Evet. Riskli yapıda tahliye/yıkım süreleri dolmasına rağmen işlem yapılmazsa, kanuna göre elektrik, su ve doğalgaz hizmetlerinin durdurulması talep edilebilir; ardından idari yıkım gündeme gelebilir.",
  },
  {
    q: "Vergi ve harç muafiyetleri var mı?",
    a: "6306 kapsamında yapılacak işlem, sözleşme, devir ve tesciller; noter harcı, tapu harcı, belediye harçları, damga vergisi, veraset ve intikal vergisi, döner sermaye ve benzeri ücretlerden muaf tutulabilir. Güncel kapsam için kanun ve vergi idaresi tebliğleri kontrol edilmelidir.",
  },
  {
    q: "Müteahhit inşaatı yarım bırakırsa ne yapılır?",
    a: "6306 kapsamında oybirliği veya arsa payına göre en az 2/3 ile karar alınıp anlaşmayan hisseler satıldıktan sonra; müteahhitten kaynaklanan sebeplerle bir yıl içinde yapım işine başlanmamış veya iş belirli seviyede durmuş ve en az altı aydır projenin bitirilmesini gerektirecek ekip/ekipmanla devam edilmiyorsa, malikler sözleşme feshi talebinde bulunabilir.",
  },
  {
    q: "Kiracıların kentsel dönüşümde hakkı var mı?",
    a: "Riskli yapıda en az bir yıldır oturan kiracılar, şartları sağladıklarında kira yardımı veya geçici konut tahsisi gibi desteklerden yararlanabilir. Evrak listeleri için kira yardımı rehberimize bakın.",
  },
] as const;

export default function KentselDonusumNedirPage() {
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
        "kentsel dönüşüm",
        "riskli yapı",
        "riskli alan",
        "mülkiyet hakkı",
        "İstanbul",
      ],
    }),
    breadcrumbSchema([
      { name: "Ana sayfa", path: "/" },
      { name: "Rehber", path: "/rehber" },
      { name: "Kentsel dönüşüm nedir", path: PATH },
    ]),
    faqPageSchema([...FAQ]),
    howToSchema({
      name: "Kentsel dönüşüm sürecini nasıl başlatırım?",
      description:
        "Riskli yapı tespiti ile kentsel dönüşüm sürecini başlatma adımları.",
      steps: [
        {
          name: "Lisanslı kuruluşa başvur",
          text: "Bakanlıkça yetkilendirilmiş kuruma riskli yapı tespiti talebinde bulunun (giderler genelde malike aittir). Liste için csb.gov.tr.",
        },
        {
          name: "Raporun onayı ve tapu şerhi",
          text: "Onaylanan rapor sonrası ilgili tapuya riskli yapı şerhi işlenir; maliklere tebliğ/ilan yapılır.",
        },
        {
          name: "İtiraz süresi",
          text: "Genellikle 15 gün içinde itiraz hakkınızı kullanabilirsiniz.",
        },
        {
          name: "Tahliye ve yıkım",
          text: "İtiraz yoksa veya reddedilirse tahliye/yıkım süreleri işler; anlaşma yolu önceliklidir.",
        },
        {
          name: "Yeniden yapım ve müteahhit",
          text: "Malik kararıyla proje, ruhsat ve yüklenici sözleşmesi; destekler için 6306 ve kampanya şartları.",
        },
      ],
    }),
  ];

  return (
    <RehberLayout
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumbLast="Kentsel dönüşüm nedir"
      schemas={schemas}
    >
      <p>
        <strong>Kentsel dönüşüm</strong>, 6306 sayılı Kanun’un 1. maddesinde;
        afet riski taşıyan bölgeler ile bu alanların dışındaki riskli yapıların
        bulunduğu arsa ve arazilerde, fen ve sanat kurallarına uygun, sağlıklı
        ve güvenli yaşam alanları oluşturmak amacıyla{" "}
        <strong>iyileştirme, yenileme ve yeniden yapılandırma</strong> olarak
        tanımlanır. Genel anlamda; plansız kentleşmeyle bozulan yapı stokunu
        düzenlemek, yeşil alan ve sosyal donatıları güçlendirmek, deprem, sel
        ve heyelan gibi afetlere karşı güvenli mekânlar üretmek demektir.
      </p>
      <p>
        5393 sayılı Belediye Kanunu m.73’te de “kentsel dönüşüm ve gelişim
        alanı” vardır; ancak burada süreç belediye öncülüğündedir.{" "}
        <strong>6306</strong>’da asıl sorumluluk ve başlatma önceliği{" "}
        <strong>mülk sahiplerine / hak sahiplerine</strong> aittir. Detay için{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          6306 sayılı kanun rehberi
        </Link>
        ne bakın.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Kentsel dönüşümün amacı nedir?
      </h2>
      <p>
        Temel hedef, insanlara <strong>sağlıklı ve güvenli yaşam alanları</strong>{" "}
        sağlamaktır (Kanun md.1). Yasa gerekçesinde de can ve mal güvenliğinin
        teminat altına alınması öne çıkar. Uygulamada rant odaklı sapmalar ve
        hukuka aykırı işlemler mağduriyet yaratabilir; bu da Anayasa m.35’teki{" "}
        <strong>mülkiyet hakkı</strong> ile doğrudan ilişkilidir. Dönüşümün
        amacından uzaklaşması, hem bireysel hak ihlali hem de yatırım güveni
        riski doğurur.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Ekonomik boyutu ve hukuki temeller
      </h2>
      <p>
        Başarılı bir dönüşüm için finansmanın doğru yönlendirilmesi gerekir;
        inşaat ve finans sektörü üzerinden ekonomiye katkı potansiyeli
        yüksektir. Ancak ekonomik ve sosyal beklentilerin karşılanması, sağlam
        bir <strong>hukuki altyapı</strong> olmadan mümkün değildir. Mevzuat;
        afet riskini hızla azaltmayı hedeflerken idarenin yetkilerini ve
        taşınmaz üzerindeki hak kullanımını da düzenler. Rantın istismar
        edilmemesi için usul, şeffaflık ve mülkiyet güvenceleri kritiktir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Mülkiyet hakkı neden kritik?
      </h2>
      <p>
        Dönüşüm projelerinde mülkiyete müdahale kaçınılmaz olabilir. Hakkın
        korunmaması; bireysel uyuşmazlıkların yanı sıra yerli ve yabancı yatırım
        güvenini de etkiler. AİHM ve Anayasa Mahkemesi içtihatları, mülkiyet
        ihlallerinde ölçülülük ve usul güvencelerini hatırlatır. Bu nedenle
        sözleşme, malik kararı ve tebligat süreçleri titizlikle belgelenmelidir.
      </p>
      <p>
        <strong>Tek başına mülkiyet</strong>te kararlar tek kişidedir.{" "}
        <strong>Birlikte mülkiyet</strong>te (paylı veya elbirliği) yıkım sonrası
        arsa kararları paydaşların birlikte hareket etmesini gerektirir; TMK
        m.688–703 hükümleri devreye girer. Kat mülkiyetinde bağımsız bölüm
        sahipleri yapı maliki sayılır.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Riskli alan nedir? Kim tespit eder?
      </h2>
      <p>
        Riskli alan; zemin yapısı veya üzerindeki yapılaşma nedeniyle can veya
        mal kaybına yol açma riski taşıyan alandır. Tespitte genel risk
        yanında; planlama/altyapı yetersizliği, imara aykırı yapılaşma, hasarlı
        altyapı-üstyapı gibi hallerin <strong>kamu düzeni ve güvenliğini
        bozacak, yaşamı kesintiye uğratacak</strong> boyutta olması aranır.
        Ayrıca alandaki yapıların belirli oranının (ör. en az %65) imara aykırı
        veya ruhsatsız olması da dayanak olabilir.
      </p>
      <p>
        Başvuru mercileri mevzuatta düzenlenir (bakanlık süreci; TOKİ, idare
        veya malikler gerekli belgelerle başvurabilir). Karar idari işlemdir;
        Resmî Gazete yayımı sonrası yargı yolu (uygulamada Danıştay / idari
        yargı süreleri) açıktır. Süre ve yetki kuralları güncel kanun
        metnine göre kontrol edilmelidir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Rezerv yapı alanı
      </h2>
      <p>
        Rezerv yapı alanı, gelecekte yeni yerleşim için ayrılan alanlardır.
        Belirleme usulü ve belgeler yönetmelikle düzenlenir: sınırları gösteren
        koordinatlı harita, ortofoto, kamuya ait taşınmaz listesi, teknik rapor,
        seçimi gerektiren özelliklere dair belgeler vb. İdari işleme karşı
        yargı yolu açıktır.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Riskli yapı nedir? Kim tespit eder?
      </h2>
      <p>
        Riskli yapı; bilimsel ve teknik verilere göre yıkılma veya ağır hasar
        riski taşıyan yapıdır. Tespit,{" "}
        <strong>Bakanlıkça lisanslı kurum ve kuruluşlar</strong>ca yapılır
        (iletişim için csb.gov.tr). Başvuru genelde elektronik sistem üzerinden
        yapılır; giderler çoğu zaman malike aittir.
      </p>
      <p>
        <strong>Tespit kapsamı dışında</strong> kalan örnekler: inşaatı
        tamamlanmamış ve içinde yaşanılmayan yapılar; taşıyıcı sistemi bozulmuş,
        ağır hasarlı ve oturulamaz durumdaki yapılar (Yönetmelik m.7/f.1
        çerçevesi).
      </p>
      <p>
        Tespit raporu ilgili müdürlük/belediyeye sunulur; eksikse düzeltilir;
        uygun bulunursa tapuya “riskli yapı” şerhi işlenir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Tebligat nasıl yapılır?
      </h2>
      <p>
        Riskli yapı tespitinde tebliğ yerine kaim olmak üzere; tutanak yapıya
        asılır, maliklere e-Devlet üzerinden bildirilir ve ilgili muhtarlıkta
        belirli süre (genelde 15 gün) ilan edilir. Muhtarlıktaki ilanın son günü
        tebliğ edilmiş sayılabilir. Ayrıca başkanlık internet sayfasında ilan
        yapılabilir. Güncel usul yönetmelik ve idare uygulamasına tabidir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        İtiraz, tahliye ve yıkım
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>İtiraz:</strong> Genellikle tebliğ sayılan tarihten itibaren{" "}
          <strong>15 gün</strong> içinde yazılır; teknik heyet inceler ve
          riskli/riskli değil kararı verir.
        </li>
        <li>
          <strong>Tahliye/yıkım:</strong> İtiraz yoksa veya reddedilirse
          maliklere süre verilir (uygulamada 60 günden az olmamak üzere; idare
          90 güne kadar süre verebilir). Süre sonunda yıkım yapılmazsa
          elektrik-su-doğalgaz kesintisi ve idari yıkım gündeme gelebilir.
        </li>
        <li>
          <strong>Yeniden yapım:</strong> Malikler arasında arsa payına göre{" "}
          <strong>en az 2/3 çoğunluk</strong> ile karar alınabilir; katılmayan
          hisseler kanundaki usulle satılabilir. Oybirliği yoksa ruhsat öncesi
          veya sonrası salt çoğunluk talebiyle satış yoluyla muvafakat
          tamamlanabilir.
        </li>
      </ul>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Vergi ve harç muafiyetleri
      </h2>
      <p>
        6306 kapsamında yapılacak işlem, sözleşme, devir ve tesciller; noter
        harcı, tapu harcı, belediye harçları, damga vergisi, veraset ve intikal
        vergisi, döner sermaye ve benzeri ücretlerden muaf tutulabilir. Güncel
        kapsam için kanun ve vergi idaresi tebliğleri kontrol edilmelidir.
      </p>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Müteahhit, sözleşme ve destekler
      </h2>
      <p>
        Riskli yapı tespiti <strong>öncesi</strong> yapılan “kentsel dönüşüm
        sözleşmeleri” 6306 kapsamındaki usule otomatik bağlanmaz; özel hukuk
        sözleşmesi olarak değerlendirilir. Müteahhit seçimi malik anlaşmasıyla
        yapılır; referans, teminat, süre ve malzeme şartları yazılı olmalıdır.
        İnşaatın uzun süre durması hâlinde sözleşme feshi imkânları kanunda
        düzenlenmiştir (bir yıl içinde başlanmama / altı ay süreyle fiili
        faaliyetin kesilmesi gibi şartlar).
      </p>
      <p>
        Devlet destekli hibe ve faiz destekli krediler (ör.{" "}
        <strong>Yarısı Bizden</strong>) ile kira/taşınma yardımları ayrı
        programlarla yürütülür. Tutar ve hesap için{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi
        </Link>
        ; evrak için{" "}
        <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
          kira yardımı
        </Link>{" "}
        rehberine bakın. Ada/site ölçekli büyük dönüşümlerde tam uzlaşma ile
        Kentsel Dönüşüm Başkanlığı, TOKİ ve Emlak Konut iş birliği gündeme
        gelebilir.
      </p>
      <p>
        İstanbul’da müteahhit arayan malikler{" "}
        <Link href="/ilan-ver" className="font-bold text-[#168f43]">
          ücretsiz ilan
        </Link>{" "}
        verebilir; numara yalnızca onaylı müteahhitlere açılır.
      </p>

      <div className="card mt-6 border-l-4 border-l-[#2cb34f] bg-[#f8f8f8] p-4 text-sm text-[#6b7280]">
        <strong className="text-[#111321]">Uyarı:</strong> Bu sayfa genel
        bilgilendirmedir; hukuki danışmanlık değildir. Süre, çoğunluk, tebligat
        ve yetki kuralları yönetmelik değişiklikleriyle güncellenebilir. Karar
        öncesi güncel mevzuat ve yetkili kurumlar ile doğrulayın.
      </div>

      <h2 className="!mt-8 text-base font-bold text-[#111321]">
        Sıkça sorulan sorular
      </h2>
      <FaqAccordion items={FAQ} />

      <p className="!mt-6">
        İlgili rehberler:{" "}
        <Link
          href="/rehber/6306-sayili-kanun"
          className="font-bold text-[#168f43]"
        >
          6306 sayılı kanun
        </Link>
        ,{" "}
        <Link href="/rehber/kira-yardimi" className="font-bold text-[#168f43]">
          kira yardımı
        </Link>
        ,{" "}
        <Link
          href="/rehber/hibe-ve-kredi-hesaplama"
          className="font-bold text-[#168f43]"
        >
          hibe ve kredi
        </Link>
        .
      </p>
    </RehberLayout>
  );
}
