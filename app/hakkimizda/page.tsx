import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { istanbulGeoMetadata } from "@/lib/seo/istanbul";

export const metadata: Metadata = istanbulGeoMetadata({
  title: "Hakkımızda | kentsele.ist",
  description:
    "kentsele.ist: İstanbul kentsel dönüşümde malikleri ve onaylı müteahhitleri buluşturan platform. Misyon, vizyon ve neden biz.",
  path: "/hakkimizda",
  keywords: [
    "kentsele hakkında",
    "kentsel dönüşüm platformu İstanbul",
    "kentsele.ist misyon",
  ],
});

export default function HakkimizdaPage() {
  return (
    <AppShell showBottomCta>
      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        kentsele.ist
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#111321]">Hakkımızda</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
        İstanbul’da kentsel dönüşümü daha şeffaf, daha hızlı ve daha güvenli
        hale getirmek için çalışıyoruz.
      </p>

      <section className="card-elevated mt-6 p-5">
        <h2 className="text-base font-bold text-[#111321]">Biz kimiz?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#374151]">
          kentsele.ist; evini yenilemek isteyen malikler ile belge onayı almış
          müteahhitleri aynı dijital platformda buluşturan İstanbul odaklı bir
          kentsel dönüşüm ilan ağıdır. Amacımız süreçleri sadeleştirmek,
          gereksiz aracıları azaltmak ve her iki taraf için de adil bir işleyiş
          sunmaktır.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
          Platform; riskli yapı dönüşümü, kat karşılığı ve hakediş gibi modeller
          etrafında maliklerin ücretsiz ilan vermesine, müteahhitlerin ise onaylı
          hesapla iletişime geçmesine olanak tanır.
        </p>
      </section>

      <section className="mt-6 grid gap-3">
        <div className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">Misyon</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            İstanbul’daki konut sahiplerini yetkin müteahhitlerle güvenli ve
            şeffaf biçimde buluşturmak; kentsel dönüşüm taleplerinin doğru
            projelere, müteahhitlerin ise gerçek fırsatlara ulaşmasını sağlamak.
          </p>
        </div>
        <div className="card p-5">
          <h2 className="text-base font-bold text-[#111321]">Vizyon</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
            İstanbul’da depreme dirençli, modern ve yaşanabilir yapı stokunun
            oluşumuna dijital altyapıyla katkı sunan, güvenilen bir dönüşüm
            platformu olmak.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="section-title">Neden kentsele.ist?</h2>
        <ul className="space-y-3">
          {[
            {
              t: "Ücretsiz malik ilanı",
              d: "Kayıt zorunluluğu olmadan ilan oluşturun; düzenleme ve yönetim için hesabınızı bağlayın.",
            },
            {
              t: "Onaylı müteahhit iletişimi",
              d: "Telefon ve ada/parsel yalnızca belge doğrulamasından geçmiş müteahhit hesaplarına açılır.",
            },
            {
              t: "İstanbul odaklı",
              d: "39 ilçe, mahalle seçimi ve ilçe sayfalarıyla yalnızca İstanbul kentsel dönüşümüne odaklanırız.",
            },
            {
              t: "Şeffaf süreç",
              d: "İlanlar admin incelemesinden geçer; değişiklikler yeniden onaya düşer.",
            },
          ].map((item) => (
            <li key={item.t} className="how-step card px-4 py-3">
              <p className="text-sm font-bold text-[#111321]">{item.t}</p>
              <p className="mt-1 text-sm text-[#6b7280]">{item.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-elevated mt-8 p-5">
        <h2 className="text-base font-bold text-[#111321]">Güvenilirlik</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#6b7280]">
          <li>
            Müteahhit hesapları belge yükleyip admin onayı alır; onay sonrası
            iletişim açılır.
          </li>
          <li>
            İlanlar yayın öncesi incelenir; malik güncellemeleri yeniden onaya
            gider.
          </li>
          <li>
            Platform aracı bir buluşma alanıdır; sözleşme ve hukuki süreç taraflar
            arasındadır.
          </li>
        </ol>
      </section>

      <div className="mt-8 flex flex-col gap-2">
        <Link href="/ilan-ver" className="btn-primary w-full">
          Ücretsiz ilan ver
        </Link>
        <Link href="/iletisim" className="btn-secondary w-full text-center">
          İletişime geç
        </Link>
      </div>
    </AppShell>
  );
}
