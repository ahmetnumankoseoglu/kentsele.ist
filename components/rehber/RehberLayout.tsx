import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";

const RELATED = [
  { href: "/rehber/6306-sayili-kanun", label: "6306 sayılı kanun" },
  { href: "/rehber/kira-yardimi", label: "Kira yardımı" },
  { href: "/rehber/hibe-ve-kredi-hesaplama", label: "Hibe & kredi" },
  { href: "/rehber", label: "Tüm rehberler" },
] as const;

export function RehberLayout({
  children,
  title,
  description,
  schemas,
  breadcrumbLast,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  schemas?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbLast: string;
}) {
  return (
    <AppShell showBottomCta={false}>
      {schemas ? <JsonLd data={schemas} /> : null}

      <nav className="mb-5 text-xs text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/" className="font-medium text-[#168f43] hover:underline">
          Ana sayfa
        </Link>
        <span className="mx-1.5 text-[#d1d5db]">/</span>
        <Link
          href="/rehber"
          className="font-medium text-[#168f43] hover:underline"
        >
          Rehber
        </Link>
        <span className="mx-1.5 text-[#d1d5db]">/</span>
        <span className="font-medium text-[#111321]">{breadcrumbLast}</span>
      </nav>

      <header className="relative overflow-hidden rounded-xl border border-[#e3e4e6] bg-gradient-to-br from-[#f4fbf6] via-white to-white p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#2cb34f]/10"
          aria-hidden
        />
        <p className="rehber-hero-chip">Bilgi bankası</p>
        <h1 className="mt-3 text-[1.35rem] font-bold leading-snug tracking-tight text-[#111321] sm:text-[1.6rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-[#6b7280]">
            {description}
          </p>
        ) : null}
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {RELATED.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="shrink-0 rounded-full border border-[#e3e4e6] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition hover:border-[#2cb34f] hover:text-[#168f43]"
          >
            {r.label}
          </Link>
        ))}
      </div>

      <article className="rehber-article card-elevated mt-5 p-5 sm:p-6">
        {children}
      </article>

      <div className="mt-6 flex flex-col gap-2">
        <Link href="/ilan-ver" className="btn-primary w-full">
          Ücretsiz kentsel dönüşüm ilanı ver
        </Link>
        <Link
          href="/rehber"
          className="btn-secondary w-full text-center"
        >
          Tüm rehberlere dön
        </Link>
      </div>
    </AppShell>
  );
}
