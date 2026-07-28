import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "KVKK ve Gizlilik Politikası",
  description:
    "kentsele.ist KVKK aydınlatma metni ve gizlilik politikası. Hangi verileri neden işlediğimiz, saklama ve haklarınız.",
  path: "/gizlilik",
  keywords: [
    "KVKK",
    "gizlilik politikası",
    "kişisel verilerin korunması",
    "kentsele aydınlatma metni",
  ],
});

export default function GizlilikPage() {
  return (
    <AppShell showBottomCta={false}>
      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        Yasal
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#111321]">
        KVKK ve Gizlilik Politikası
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        Son güncelleme: 29 Temmuz 2026. Bu metin bilgilendirme amaçlıdır; yasal
        danışmanlık yerine geçmez.
      </p>

      <article className="mt-6 space-y-6 text-sm leading-relaxed text-[#374151]">
        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">1. Veri sorumlusu</h2>
          <p className="mt-2">
            <strong className="text-[#111321]">kentsele.ist</strong> platformu
            üzerinden kişisel verileriniz, 6698 sayılı Kişisel Verilerin
            Korunması Kanunu (“KVKK”) kapsamında işlenir. İletişim:{" "}
            <Link href="/iletisim" className="font-semibold text-[#168f43]">
              /iletisim
            </Link>
            .
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            2. Hangi verileri işliyoruz?
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-[#111321]">İlan verileri:</strong> ilçe,
              mahalle, ada/parsel, kat/daire bilgisi, ödeme tercihi, açıklama,
              imar belge işaretleri, iletişim adı, telefon, e-posta.
            </li>
            <li>
              <strong className="text-[#111321]">Hesap verileri:</strong> ad
              soyad, e-posta, telefon, rol (malik / müteahhit), firma unvanı
              (müteahhit).
            </li>
            <li>
              <strong className="text-[#111321]">Müteahhit belgeleri:</strong>{" "}
              vergi levhası, ticaret sicil, imza sirküleri vb. dosyalar (özel
              depolama alanı).
            </li>
            <li>
              <strong className="text-[#111321]">İletişim formu:</strong> ad,
              e-posta, telefon (opsiyonel), konu, mesaj, varsa admin cevabı.
            </li>
            <li>
              <strong className="text-[#111321]">Teknik veriler:</strong> oturum
              çerezleri, güvenlik logları, IP ve tarayıcı bilgileri (güvenlik ve
              hizmet sürekliliği için).
            </li>
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            3. İşleme amaçları ve hukuki sebepler
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>İlan yayını, moderasyon ve ilan yönetimi</li>
            <li>
              Onaylı müteahhitlerin malik ile iletişime geçebilmesi (numara
              yalnızca onay sonrası açılır)
            </li>
            <li>Müteahhit kimlik/belge doğrulaması</li>
            <li>Hesap oluşturma, giriş, şifre sıfırlama</li>
            <li>İşlem bilgilendirme e-postaları (ilan durumu, üyelik vb.)</li>
            <li>Destek taleplerine yanıt</li>
            <li>Güvenlik, kötüye kullanımın önlenmesi, yasal yükümlülükler</li>
          </ul>
          <p className="mt-3 text-[#6b7280]">
            Hukuki sebepler: sözleşmenin kurulması/ifası, meşru menfaat, açık
            rıza (gerektiğinde), kanuni yükümlülük.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            4. Verilerin aktarımı
          </h2>
          <p className="mt-2">
            Hizmeti sunmak için altyapı sağlayıcılarıyla (ör. veritabanı, dosya
            depolama, e-posta gönderimi, barındırma) sınırlı ve amaca uygun
            şekilde paylaşım yapılabilir. Bu sağlayıcılar yalnızca hizmet
            kapsamında veriyi işler.
          </p>
          <p className="mt-2">
            <strong className="text-[#111321]">Malik telefon / e-posta</strong>{" "}
            herkese açık değildir; yalnızca belge onayı almış müteahhit
            hesaplarına ve platform yönetimi süreçlerine açılır.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            5. Saklama süresi
          </h2>
          <p className="mt-2">
            Veriler, işleme amacının gerektirdiği süre ve yasal zamanaşımı
            süreleri boyunca saklanır. İlan kaldırıldığında veya hesap
            kapatıldığında ilgili kayıtlar silinir veya anonimleştirilir; yasal
            zorunluluk varsa daha uzun saklanabilir.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">6. Çerezler</h2>
          <p className="mt-2">
            Oturum ve güvenlik için zorunlu çerezler kullanılır (ör. giriş
            oturumu, admin paneli). Reklam amaçlı üçüncü taraf çerezleri
            kullanılmıyorsa bu metinde belirtilmez; eklendiğinde bu sayfa
            güncellenir.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            7. KVKK kapsamındaki haklarınız
          </h2>
          <p className="mt-2">
            KVKK m.11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme,
            işlenmişse bilgi talep etme, amaca uygun kullanılıp
            kullanılmadığını öğrenme, yurt içi/yurt dışı aktarımı bilme,
            düzeltme, silme/yok etme talep etme, itiraz ve zararın giderilmesini
            isteme haklarına sahipsiniz.
          </p>
          <p className="mt-2">
            Başvuru için:{" "}
            <Link href="/iletisim" className="font-semibold text-[#168f43]">
              iletişim formu
            </Link>
            .
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            8. Güvenlik
          </h2>
          <p className="mt-2">
            Erişim yetkilendirmesi, şifreli bağlantılar (HTTPS), hizmet rolü
            anahtarlarının sunucu tarafında tutulması ve müteahhit belgelerinin
            özel (private) depolama alanında saklanması gibi teknik ve idari
            tedbirler uygulanır. Hiçbir sistem %100 riskten arınmış değildir;
            şüpheli durumda bize bildirin.
          </p>
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">
            9. Değişiklikler
          </h2>
          <p className="mt-2">
            Bu metin güncellenebilir. Önemli değişikliklerde sayfa üzerindeki
            “Son güncelleme” tarihi yenilenir. Platformu kullanmaya devam
            etmeniz, güncel metni okuduğunuz kabulü ile birlikte değerlendirilir.
          </p>
        </section>
      </article>

      <p className="mt-8 text-center text-sm text-[#6b7280]">
        <Link href="/iletisim" className="font-bold text-[#168f43]">
          İletişim
        </Link>
        {" · "}
        <Link href="/hakkimizda" className="font-bold text-[#168f43]">
          Hakkımızda
        </Link>
      </p>
    </AppShell>
  );
}
