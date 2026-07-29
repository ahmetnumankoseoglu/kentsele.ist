import Link from "next/link";

export type Crumb = {
  name: string;
  href?: string;
};

/** Görünür breadcrumb — JSON-LD BreadcrumbList ile aynı hiyerarşiyi kullan */
export function Breadcrumbs({
  items,
  className = "mb-4",
}: {
  items: Crumb[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <nav
      className={`text-xs text-[#6b7280] ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center">
              {i > 0 ? <span className="mx-1.5 text-[#9ca3af]">/</span> : null}
              {last || !item.href ? (
                <span
                  className={last ? "font-medium text-[#111321]" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-[#168f43] hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
