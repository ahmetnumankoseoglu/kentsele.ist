/**
 * Haber gövdesi HTML allowlist — XSS'e karşı basit sanitizer.
 * TipTap çıktısı + eski düz metin uyumu.
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "span",
]);

const ALLOWED_ATTR: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "title"]),
  span: new Set(["class"]),
  p: new Set(["class"]),
  h2: new Set(["class"]),
  h3: new Set(["class"]),
  h4: new Set(["class"]),
};

function isSafeHref(href: string): boolean {
  const t = href.trim().toLowerCase();
  return (
    t.startsWith("https://") ||
    t.startsWith("http://") ||
    t.startsWith("/") ||
    t.startsWith("mailto:") ||
    t.startsWith("#")
  );
}

export function looksLikeHtml(input: string): boolean {
  return /<[a-z][\s\S]*>/i.test(input);
}

export function sanitizeNewsHtml(dirty: string): string {
  if (!dirty) return "";
  // Server / client: DOMParser when available
  if (typeof DOMParser !== "undefined") {
    return sanitizeWithDom(dirty);
  }
  // Edge/SSR without DOM — strip scripts/styles roughly
  return dirty
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function sanitizeWithDom(dirty: string): string {
  const doc = new DOMParser().parseFromString(
    `<div id="root">${dirty}</div>`,
    "text/html"
  );
  const root = doc.getElementById("root");
  if (!root) return "";

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === 1) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          // unwrap: keep children
          while (el.firstChild) {
            node.insertBefore(el.firstChild, el);
          }
          node.removeChild(el);
          continue;
        }
        // strip bad attrs
        const allowed = ALLOWED_ATTR[tag] ?? new Set<string>();
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          if (!allowed.has(name)) {
            el.removeAttribute(attr.name);
            continue;
          }
          if (name === "href" && !isSafeHref(attr.value)) {
            el.removeAttribute(attr.name);
          }
          if (name === "target") {
            el.setAttribute("rel", "noopener noreferrer");
          }
        }
        walk(el);
      } else if (child.nodeType === 8) {
        // comments
        node.removeChild(child);
      }
    }
  };

  walk(root);
  return root.innerHTML;
}
