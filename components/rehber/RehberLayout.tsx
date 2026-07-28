import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareButtons } from "@/components/seo/ShareButtons";
import { OfficialSources } from "@/components/seo/OfficialSources";
import { getSiteUrl } from "@/lib/seo/site";

export function RehberLayout({
  children,
  title,
  description,
  schemas,
  breadcrumbLast,
  path,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  schemas?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbLast: string;
  /** Canonical path for share URL, e.g. /rehber/kira-yardimi */
  path?: string;
}) {
  const shareUrl = path ? `${getSiteUrl()}${path}` : getSiteUrl();

  return (
    <AppShell showBottomCta>
      {schemas ? <JsonLd data={schemas} /> : null}
      <nav className="mb-4 text-xs text-[#6b7280]">
        <Link href="/" className="font-medium text-[#168f43]">
          Ana sayfa
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/rehber" className="font-medium text-[#168f43]">
          Rehber ana
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
      <OfficialSources className="mt-8" />
      <ShareButtons
        className="mt-6"
        url={shareUrl}
        title={title}
      />
      <p className="mt-8 text-center">
        <Link href="/rehber" className="text-sm font-bold text-[#168f43]">
          ← Rehber dizinine dön
        </Link>
      </p>
    </AppShell>
  );
}
