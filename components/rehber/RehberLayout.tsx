import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";

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
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          Ana sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/rehber" className="font-medium text-[#168f43]">
          Rehber
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#111321]">{breadcrumbLast}</span>
      </nav>
      <p className="text-xs font-bold uppercase tracking-wider text-[#2cb34f]">
        Bilgi bankası
      </p>
      <h1 className="mt-1 text-[22px] font-bold leading-snug text-[#111321] sm:text-2xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          {description}
        </p>
      ) : null}
      <article className="mt-6 space-y-4 text-sm leading-relaxed text-[#374151]">
        {children}
      </article>
      <div className="mt-8 flex flex-col gap-2">
        <Link href="/ilan-ver" className="btn-primary w-full">
          Ücretsiz kentsel dönüşüm ilanı ver
        </Link>
        <Link
          href="/rehber"
          className="text-center text-sm font-bold text-[#168f43]"
        >
          ← Tüm rehberler
        </Link>
      </div>
    </AppShell>
  );
}
