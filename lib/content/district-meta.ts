import type { IstanbulIlce } from "@/lib/constants/istanbul-ilceler";

const ANADOLU: IstanbulIlce[] = [
  "Adalar",
  "Ataşehir",
  "Beykoz",
  "Çekmeköy",
  "Kadıköy",
  "Kartal",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sultanbeyli",
  "Şile",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
];

export type DistrictMeta = {
  ilce: IstanbulIlce;
  side: "Anadolu Yakası" | "Avrupa Yakası";
  character: string;
  focusTopics: string[];
  neighboring: IstanbulIlce[];
};

const EXTRA: Partial<
  Record<
    IstanbulIlce,
    { character: string; focusTopics: string[] }
  >
> = {
  Kadıköy: {
    character:
      "Yoğun yapı stoku, yüksek emlak değeri ve aktif malik örgütlenmesiyle öne çıkan merkezi bir ilçedir.",
    focusTopics: [
      "kat karşılığı paylaşım oranları",
      "riskli yapı tespiti",
      "mahalle bazlı mutabakat",
    ],
  },
  Bayrampaşa: {
    character:
      "Sanayi ve konut dokusunun iç içe geçtiği, parsel bazlı dönüşüm taleplerinin sık görüldüğü bir ilçedir.",
    focusTopics: [
      "parsel birleştirme",
      "ticari alanlı projeler",
      "hakediş ve kat karşılığı modelleri",
    ],
  },
  Fatih: {
    character:
      "Tarihi doku, dar parseller ve yüksek malik sayısı nedeniyle planlama ve mutabakatın kritik olduğu bir bölgedir.",
    focusTopics: [
      "koruma-imar dengesi",
      "küçük parsel çözümleri",
      "malik iletişimi",
    ],
  },
  Bahçelievler: {
    character:
      "Yoğun nüfus ve deprem riski farkındalığıyla kentsel dönüşümün en çok konuşulduğu ilçelerdendir.",
    focusTopics: [
      "site ve blok dönüşümü",
      "devlet destekleri",
      "süreç yönetimi",
    ],
  },
  Üsküdar: {
    character:
      "Boğaz silueti, eğimli arazi ve karma yapı stokuyla proje tasarımının öne çıktığı bir ilçedir.",
    focusTopics: [
      "eğimli arsa çözümleri",
      "görsel etki ve emsal",
      "kat karşılığı teklifler",
    ],
  },
  Maltepe: {
    character:
      "Sahil bandı ve iç mahallelerde farklı emsal ve talep profilleri barındıran dinamik bir ilçedir.",
    focusTopics: [
      "sahil–iç mahalle farkı",
      "çok daireli projeler",
      "müteahhit seçimi",
    ],
  },
  Beşiktaş: {
    character:
      "Yüksek arsa değeri ve prestijli konum nedeniyle teklif kalitesinin belirleyici olduğu bir bölgedir.",
    focusTopics: [
      "değerleme ve paylaşım",
      "lüks segment beklentileri",
      "süre ve teminat",
    ],
  },
  Esenyurt: {
    character:
      "Geniş konut stoku ve hızlı kentleşme ile ölçekli dönüşüm ve yeni proje taleplerinin yüksek olduğu bir ilçedir.",
    focusTopics: [
      "büyük ölçekli projeler",
      "site yönetimi mutabakatı",
      "finansman modelleri",
    ],
  },
};

export function getDistrictSide(ilce: IstanbulIlce): DistrictMeta["side"] {
  return ANADOLU.includes(ilce) ? "Anadolu Yakası" : "Avrupa Yakası";
}

export function getDistrictMeta(
  ilce: IstanbulIlce,
  all: readonly IstanbulIlce[]
): DistrictMeta {
  const side = getDistrictSide(ilce);
  const extra = EXTRA[ilce];
  const idx = all.indexOf(ilce);
  const neighboring = [
    all[(idx - 1 + all.length) % all.length]!,
    all[(idx + 1) % all.length]!,
    all[(idx + 2) % all.length]!,
  ].filter((x) => x !== ilce) as IstanbulIlce[];

  return {
    ilce,
    side,
    character:
      extra?.character ??
      `${side} üzerinde konumlanan ${ilce}, İstanbul kentsel dönüşüm gündeminde malik ve müteahhitlerin yakından takip ettiği ilçelerden biridir.`,
    focusTopics: extra?.focusTopics ?? [
      "riskli yapı süreci",
      "kat karşılığı ve hakediş",
      "malik mutabakatı",
    ],
    neighboring,
  };
}

/** Long-form SEO sections for district landing pages */
export function buildDistrictSeoSections(meta: DistrictMeta) {
  const { ilce, side, character, focusTopics, neighboring } = meta;
  return {
    intro: `${ilce} kentsel dönüşüm süreci, İstanbul’un ${side} genelindeki deprem riski, yapı stoku yaşı ve imar koşullarıyla doğrudan ilişkilidir. ${character} kentsele.ist üzerinde ${ilce} için ücretsiz ilan oluşturabilir; onaylı müteahhitler ilanları inceleyerek sizinle iletişime geçebilir.`,

    whyTitle: `Neden ${ilce} kentsel dönüşüm gündemde?`,
    whyBody: [
      `${ilce}’da kentsel dönüşüm yalnızca “yık-yap” demek değildir. Riskli yapı tespiti, maliklerin ortak kararı, proje modeli (kat karşılığı, hakediş, peşin veya karma), imar ve ruhsat süreçleri ile inşaat takvimi bir bütün olarak ele alınmalıdır.`,
      `Özellikle ${focusTopics[0]} ve ${focusTopics[1]} başlıkları, ${ilce} malikleri için teklif karşılaştırırken en çok sorulan konulardır. Şeffaf iletişim ve yazılı teklif, sürecin sağlıklı ilerlemesi için temel şarttır.`,
      `İstanbul genelinde kentsel dönüşüm talebi ilçeden ilçeye değişse de ${ilce} için ortak payda; güvenilir müteahhit bulmak, hak kaybını önlemek ve süreci belgelendirerek ilerletmektir.`,
    ],

    processTitle: `${ilce}’da kentsel dönüşüm adımları`,
    processSteps: [
      {
        t: "Mevcut durum ve risk analizi",
        d: `${ilce}’daki binanızın yapı tipi, yaşı, zemin koşulları ve riskli yapı durumu netleştirilir. Resmî tespit süreci yetkili kurumlar üzerinden yürür.`,
      },
      {
        t: "Malik mutabakatı",
        d: "Kat malikleri arasında dönüşüm kararı ve temsil yetkisi netleşir. Ne kadar çok malik uyumluysa süreç o kadar hızlı ilerler.",
      },
      {
        t: "Proje ve paylaşım modeli",
        d: `${focusTopics.join(", ")} gibi başlıklarda kat karşılığı veya hakediş tercihi belirlenir. Daire adedi, metrekare ve teslim koşulları yazıya dökülür.`,
      },
      {
        t: "Müteahhit seçimi ve sözleşme",
        d: `${ilce} kentsel dönüşüm ilanınızı kentsele.ist’te yayınlayarak onaylı müteahhitlerden dönüş alabilirsiniz. Sözleşme, teminat ve süre maddeleri kritiktir.`,
      },
      {
        t: "Ruhsat, yıkım ve inşaat",
        d: "Proje onayı sonrası yıkım ve inşaat takvimi başlar. Malik bilgilendirmesi ve hakediş basamakları düzenli takip edilmelidir.",
      },
    ],

    modelsTitle: `${ilce} için yaygın iş modelleri`,
    models: [
      {
        t: "Kat karşılığı",
        d: `Müteahhit inşaatı üstlenir; malikler ve müteahhit arasında bağımsız bölüm paylaşımı yapılır. ${ilce}’da arsa değeri yüksek bölgelerde paylaşım oranları dikkatle müzakere edilir.`,
      },
      {
        t: "Hakedişe tabi",
        d: "İlerleme basamaklarına göre ödeme planı çıkar. Nakit akışı ve denetim mekanizması şeffaf olmalıdır.",
      },
      {
        t: "Peşin / karma",
        d: "Kısmi peşinat, kamu destekleri veya karma modeller bazı ${ilce} projelerinde gündeme gelebilir. Her model için yazılı şartname şarttır.",
      },
    ],

    tipsTitle: `${ilce} malikleri için pratik ipuçları`,
    tips: [
      `En az 2–3 müteahhit teklifini ${ilce} özelinde karşılaştırın; sadece fiyat değil süre, teminat ve referans sorun.`,
      "Sözleşmede teslim tarihi, gecikme cezası, malzeme standardı ve bağımsız bölüm listesini açık yazın.",
      "İlan verirken kat sayısı, daire adedi, ödeme tercihi ve kısa proje notunu net belirtin; doğru eşleşme hızlanır.",
      "Telefon numaranız yalnızca onaylı müteahhit hesaplarına açılır; bu, gereksiz aramaları azaltmaya yardımcı olur.",
    ],

    faq: [
      {
        q: `${ilce} kentsel dönüşüm ilanı ücretsiz mi?`,
        a: `Evet. kentsele.ist üzerinden ${ilce} kentsel dönüşüm ilanı oluşturmak ücretsizdir. İlan vermek için kayıt zorunlu değildir; düzenlemek için hesap gerekir.`,
      },
      {
        q: `${ilce}’da müteahhitler numarama nasıl ulaşır?`,
        a: "Yalnızca belge yükleyip admin onayı almış müteahhit hesapları malik iletişim bilgilerini görüntüleyebilir. Herkese açık numara gösterimi yoktur.",
      },
      {
        q: `${ilce} için hangi bilgiler ilanda olmalı?`,
        a: "İlçe/mahalle, hedef kat ve daire sayısı, ödeme tercihi (kat karşılığı, hakediş vb.) ve kısa ihtiyaç metni yeterlidir. Ada/parsel ve mevcut durum notu teklif kalitesini artırır.",
      },
      {
        q: `${ilce} kentsel dönüşüm ne kadar sürer?`,
        a: "Süre; mutabakat, ruhsat, yıkım ve inşaat kapsamına göre değişir. İlan ve teklif aşaması günler içinde başlayabilir; toplam proje süresi genelde aylar–yıllar mertebesindedir.",
      },
      {
        q: `Komşu ilçelerde de ilan verebilir miyim?`,
        a: `kentsele.ist yalnızca İstanbul ilçelerini kapsar. ${neighboring.join(", ")} gibi yakın ilçelerin de ayrı SEO sayfaları ve ilan filtreleri bulunur.`,
      },
    ],

    closing: `${ilce} kentsel dönüşüm yolculuğunda doğru bilgi ve doğru eşleşme zaman kazandırır. kentsele.ist; maliklerin ücretsiz ilan verdiği, müteahhitlerin onaylı hesapla iletişim kurduğu İstanbul odaklı bir platformdur. Hemen ${ilce} ilanınızı oluşturun veya güncel ${ilce} kentsel dönüşüm ilanlarını inceleyin.`,
  };
}
