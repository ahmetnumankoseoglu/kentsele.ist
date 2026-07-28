/**
 * İBB kira desteği tutarları
 * Kaynak: kentseldonusum.ibb.istanbul — 12.11.2025 / 1277 sayılı Meclis Kararı
 * (+ Mart ayı güçlendirme ruhsatı kapsam genişletmesi)
 *
 * Bilgilendirme amaçlıdır; güncel tutar ve şart için İBB / ilçe birimi esas alınır.
 */
export const IBB_KIRA_DESTEGI = {
  kaynak:
    "İBB Kentsel Dönüşüm Planlama — 12.11.2025 tarih ve 1277 sayılı Meclis Kararı",
  resmiUrl: "https://kentseldonusum.ibb.istanbul/riskli-binalar-icin-kira-destegi/",
  /** Bakanlık kira yardımına ek (ilave) */
  hizliTaramaDE: {
    baslik: "Hızlı tarama D–E (yıkım / yeniden yapım)",
    aciklama:
      "Hızlı Tarama ile D veya E risk sınıfı öncelikli yapılar; yıkım sonrası. ÇŞB kira yardımına ek.",
    malikIkamet: { aylik: 10_000, emekli: 12_000, ay: 18 },
    malikIkametEtmeyen: { aylik: 6_500, ay: 18 },
    kiraci: { aylik: 10_000, emekli: 12_000, ay: 12 },
  },
  guclendirme: {
    baslik: "Güçlendirme ruhsatı (hızlı tarama + TBDY)",
    aciklama:
      "Hızlı tarama ile incelenen, birlikte güçlendirilecek ve TBDY’ye uygun güçlendirme ruhsatı/izin belgesi alınan binalar. ÇŞB kira yardımına ek.",
    malikIkamet: { aylik: 10_000, emekli: 12_000, ay: 18 },
    malikIkametEtmeyen: { aylik: 6_500, ay: 18 },
    kiraci: { aylik: 10_000, emekli: 12_000, ay: 12 },
  },
  riskliRezervAlan: {
    baslik: "İBB yetkisinde riskli / rezerv alan",
    aciklama:
      "İBB yetkisindeki riskli alan ve rezerv alanlardaki hak sahipleri.",
    malik: { aylik: 18_000, emekli: 20_000, ay: 48 },
    kiraci: { aylik: 18_000, emekli: 20_000, ay: 12 },
  },
  iletisim: {
    telefon: "+90 212 449 48 68 / 48 69",
    email: "kdmasa@ibb.gov.tr",
    adres:
      "İBB Bakırköy Hizmet Binası, Osmaniye, Çobançeşme Koşuyolu Bulvarı No:5, Bakırköy/İstanbul",
  },
} as const;
