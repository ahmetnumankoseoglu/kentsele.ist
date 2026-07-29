/** Authoritative external links — SEO + user trust on rehber pages */
const SOURCES = [
  {
    href: "https://yapiisleri.csb.gov.tr/",
    label: "Yapı İşleri Genel Müdürlüğü (CSB)",
    short: "Yapı İşleri GM",
  },
  {
    href: "https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6306.pdf",
    label: "6306 sayılı kanun — PDF metin",
    short: "6306 sayılı kanun (PDF)",
  },
  {
    href: "https://www.ibb.istanbul/",
    label: "İstanbul Büyükşehir Belediyesi",
    short: "İBB resmi site",
  },
] as const;

export function OfficialSources({
  className = "",
}: {
  className?: string;
}) {
  return (
    <aside
      className={`rounded-[3px] border border-[#e3e4e6] bg-[#f8f8f8] p-4 ${className}`}
    >
      <h2 className="text-sm font-bold text-[#111321]">Resmi kaynaklar</h2>
      <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
        Tutar ve prosedürler değişebilir; güncel bilgi için kurum sitelerini
        kontrol edin.
      </p>
      <ul className="mt-3 space-y-2">
        {SOURCES.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-sm font-semibold text-[#168f43] underline-offset-2 hover:underline"
              title={s.label}
            >
              {s.short}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
