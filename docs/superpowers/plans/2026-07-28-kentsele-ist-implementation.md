# kentsele.ist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** İstanbul-only kentsel dönüşüm ilan panosu: public liste/detay, Armut tarzı ilan formu, malik yönetim linki, admin teyit paneli — Next.js + Supabase.

**Architecture:** Next.js App Router (TypeScript) sunucu bileşenleri ve route handler’larla Supabase Postgres’e bağlanır. Public okumalar `listings_public` view / server-side maskeleme ile telefon gizler. Malik erişimi `manage_token` ile; admin erişimi HTTP-only cookie + `ADMIN_PASSWORD` ile service role kullanır. Coğrafya sabit: 39 İstanbul ilçesi.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase JS, Vitest (unit), zod (validasyon)

**Spec:** `docs/superpowers/specs/2026-07-28-kentsele-ist-design.md`

---

## File map

| Path | Responsibility |
|------|----------------|
| `package.json` | Bağımlılıklar, scripts |
| `app/layout.tsx` | Root layout, font, meta |
| `app/page.tsx` | Ana sayfa: hero + ilçe filtresi + ilan listesi |
| `app/ilanlar/page.tsx` | Alias liste (opsiyonel redirect veya aynı UI) |
| `app/ilan/[slug]/page.tsx` | İlan detay |
| `app/ilan-ver/page.tsx` | Wizard shell |
| `app/yonet/[token]/page.tsx` | Malik paneli |
| `app/yonetim/page.tsx` | Admin login + dashboard redirect |
| `app/yonetim/ilanlar/page.tsx` | Admin ilan listesi |
| `app/yonetim/ilanlar/[id]/page.tsx` | Admin ilan detay |
| `app/api/ilanlar/route.ts` | POST yeni ilan |
| `app/api/yonet/[token]/route.ts` | PATCH malik güncelle / anlaşma bildir |
| `app/api/yonetim/login/route.ts` | Admin login |
| `app/api/yonetim/logout/route.ts` | Admin logout |
| `app/api/yonetim/ilanlar/[id]/route.ts` | Admin status/update |
| `components/layout/*` | Header, bottom CTA, shell |
| `components/ilan/*` | Kart, badge, iletişim butonları, filtre |
| `components/ilan-ver/*` | Wizard adımları |
| `components/yonetim/*` | Admin formlar |
| `lib/constants/istanbul-ilceler.ts` | 39 ilçe + slug map |
| `lib/constants/listing.ts` | status, ödeme etiketleri |
| `lib/slug.ts` | TR transliterate + slug üret |
| `lib/phone.ts` | TR telefon normalize / WhatsApp |
| `lib/validations/listing.ts` | zod şemaları |
| `lib/supabase/server.ts` | Server client (anon) |
| `lib/supabase/admin.ts` | Service role client |
| `lib/auth/admin-session.ts` | Cookie imza/doğrulama |
| `lib/listings/*` | Query helpers |
| `supabase/migrations/001_listings.sql` | Tablo, view, RLS, index |
| `types/listing.ts` | Shared types |
| `vitest.config.ts` | Unit test config |
| `tests/unit/*.test.ts` | slug, phone, ilçe |

---

### Task 1: Next.js iskeleti

**Files:**
- Create: project root via `create-next-app`
- Create: `.env.example`
- Create: `vitest.config.ts`

- [ ] **Step 1: Scaffold Next.js**

Boş repoda (docs zaten var; üzerine kur):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --turbopack --yes
```

Not: Dizin boş değilse create-next-app uyarı verebilir; gerekirse geçici dizinde oluşturup dosyaları taşı veya `--yes` ile mevcut non-conflicting files ile devam et. `docs/` korunmalı.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js zod
npm install -D vitest @vitejs/plugin-react
```

- [ ] **Step 3: Add scripts to package.json**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Create `.env.example`**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind and Vitest"
```

---

### Task 2: İstanbul 39 ilçe sabiti + listing constants

**Files:**
- Create: `lib/constants/istanbul-ilceler.ts`
- Create: `lib/constants/listing.ts`
- Create: `tests/unit/istanbul-ilceler.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/istanbul-ilceler.test.ts
import { describe, it, expect } from "vitest";
import { ISTANBUL_ILCELER, isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";

describe("ISTANBUL_ILCELER", () => {
  it("contains exactly 39 districts", () => {
    expect(ISTANBUL_ILCELER).toHaveLength(39);
  });

  it("includes Kadıköy and Eyüpsultan", () => {
    expect(ISTANBUL_ILCELER).toContain("Kadıköy");
    expect(ISTANBUL_ILCELER).toContain("Eyüpsultan");
  });

  it("rejects non-Istanbul district", () => {
    expect(isValidIstanbulIlce("Ankara")).toBe(false);
    expect(isValidIstanbulIlce("Kadıköy")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- tests/unit/istanbul-ilceler.test.ts
```

Expected: cannot find module or undefined export.

- [ ] **Step 3: Implement constants**

```ts
// lib/constants/istanbul-ilceler.ts
/** İstanbul'un 39 ilçesi — alfabetik, tek kaynak. Ürün yalnızca İstanbul. */
export const ISTANBUL_ILCELER = [
  "Adalar",
  "Arnavutköy",
  "Ataşehir",
  "Avcılar",
  "Bağcılar",
  "Bahçelievler",
  "Bakırköy",
  "Başakşehir",
  "Bayrampaşa",
  "Beşiktaş",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Büyükçekmece",
  "Çatalca",
  "Çekmeköy",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kağıthane",
  "Kartal",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Silivri",
  "Sultanbeyli",
  "Sultangazi",
  "Şile",
  "Şişli",
  "Tuzla",
  "Ümraniye",
  "Üsküdar",
  "Zeytinburnu",
] as const;

export type IstanbulIlce = (typeof ISTANBUL_ILCELER)[number];

export function isValidIstanbulIlce(value: string): value is IstanbulIlce {
  return (ISTANBUL_ILCELER as readonly string[]).includes(value);
}
```

```ts
// lib/constants/listing.ts
export const LISTING_STATUSES = [
  "incelemede",
  "yayinda",
  "teklif_saglaniyor",
  "anlasildi",
  "kaldirildi",
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const PUBLIC_STATUSES: ListingStatus[] = [
  "yayinda",
  "teklif_saglaniyor",
  "anlasildi",
];

export const STATUS_LABELS: Record<ListingStatus, string> = {
  incelemede: "İncelemede",
  yayinda: "Yayında",
  teklif_saglaniyor: "Teklif sağlanıyor",
  anlasildi: "Anlaşıldı",
  kaldirildi: "Kaldırıldı",
};

export const ODEME_TERCIHLERI = [
  "kat_karsiligi",
  "hakedis",
  "pesin",
  "diger",
  "belirsiz",
] as const;

export type OdemeTercihi = (typeof ODEME_TERCIHLERI)[number];

export const ODEME_LABELS: Record<OdemeTercihi, string> = {
  kat_karsiligi: "Kat karşılığı",
  hakedis: "Hakedişe tabi",
  pesin: "Peşin nakit",
  diger: "Diğer",
  belirsiz: "Belirsiz",
};

export const KAT_SECENEKLERI = ["1", "2", "3", "4", "5", "6", "7", "8+"] as const;

export const DAIRE_SECENEKLERI = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
  "30",
  "40",
  "50+",
] as const;
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- tests/unit/istanbul-ilceler.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/constants tests/unit/istanbul-ilceler.test.ts
git commit -m "feat: add Istanbul 39 districts and listing constants"
```

---

### Task 3: Slug ve telefon yardımcıları

**Files:**
- Create: `lib/slug.ts`
- Create: `lib/phone.ts`
- Create: `tests/unit/slug.test.ts`
- Create: `tests/unit/phone.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/slug.test.ts
import { describe, it, expect } from "vitest";
import { slugifyTr, buildListingSlug } from "@/lib/slug";

describe("slugifyTr", () => {
  it("transliterates Turkish characters", () => {
    expect(slugifyTr("Kadıköy")).toBe("kadikoy");
    expect(slugifyTr("Kağıthane")).toBe("kagithane");
    expect(slugifyTr("Eyüpsultan")).toBe("eyupsultan");
    expect(slugifyTr("Şişli")).toBe("sisli");
  });
});

describe("buildListingSlug", () => {
  it("builds readable Turkish ASCII slug", () => {
    const slug = buildListingSlug({
      ilce: "Kadıköy",
      katSayisi: "5",
      daireSayisi: "12",
      odemeTercihi: "kat_karsiligi",
      shortId: "a3f2",
    });
    expect(slug).toBe("kadikoy-5-kat-12-daire-kat-karsiligi-a3f2");
  });
});
```

```ts
// tests/unit/phone.test.ts
import { describe, it, expect } from "vitest";
import { normalizeTrPhone, toWhatsAppUrl, formatPhoneDisplay } from "@/lib/phone";

describe("normalizeTrPhone", () => {
  it("normalizes common TR formats to +90...", () => {
    expect(normalizeTrPhone("0532 123 45 67")).toBe("+905321234567");
    expect(normalizeTrPhone("5321234567")).toBe("+905321234567");
    expect(normalizeTrPhone("+90 532 123 45 67")).toBe("+905321234567");
  });

  it("returns null for invalid", () => {
    expect(normalizeTrPhone("123")).toBeNull();
  });
});

describe("toWhatsAppUrl", () => {
  it("builds wa.me link without plus", () => {
    expect(toWhatsAppUrl("+905321234567")).toBe("https://wa.me/905321234567");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- tests/unit/slug.test.ts tests/unit/phone.test.ts
```

- [ ] **Step 3: Implement**

```ts
// lib/slug.ts
import type { OdemeTercihi } from "@/lib/constants/listing";

const TR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugifyTr(input: string): string {
  const mapped = input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("");
  return mapped
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function buildListingSlug(parts: {
  ilce: string;
  katSayisi: string;
  daireSayisi: string;
  odemeTercihi: OdemeTercihi | string;
  shortId: string;
}): string {
  const ilce = slugifyTr(parts.ilce);
  const kat = slugifyTr(parts.katSayisi);
  const daire = slugifyTr(parts.daireSayisi);
  const odeme = slugifyTr(String(parts.odemeTercihi).replace(/_/g, "-"));
  const id = parts.shortId.toLowerCase();
  return `${ilce}-${kat}-kat-${daire}-daire-${odeme}-${id}`;
}

export function randomShortId(length = 4): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}
```

```ts
// lib/phone.ts
/** Digits only; accepts 05xx, 5xx, +905xx, 905xx */
export function normalizeTrPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("90") && national.length === 12) {
    national = national.slice(2);
  }
  if (national.startsWith("0") && national.length === 11) {
    national = national.slice(1);
  }
  if (national.length !== 10 || !national.startsWith("5")) {
    return null;
  }
  return `+90${national}`;
}

export function toWhatsAppUrl(e164: string): string {
  return `https://wa.me/${e164.replace(/\D/g, "")}`;
}

export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, "");
  // 90 5xx xxx xx xx
  if (d.length === 12 && d.startsWith("90")) {
    const n = d.slice(2);
    return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}`;
  }
  return e164;
}

export function toTelHref(e164: string): string {
  return `tel:${e164}`;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add lib/slug.ts lib/phone.ts tests/unit
git commit -m "feat: add TR slug and phone helpers"
```

---

### Task 4: Types + zod validasyon

**Files:**
- Create: `types/listing.ts`
- Create: `lib/validations/listing.ts`

- [ ] **Step 1: Types**

```ts
// types/listing.ts
import type { ListingStatus, OdemeTercihi } from "@/lib/constants/listing";

export type Listing = {
  id: string;
  slug: string;
  ilce: string;
  mahalle: string | null;
  kat_sayisi: string;
  daire_sayisi: string;
  odeme_tercihi: OdemeTercihi;
  aciklama: string;
  iletisim_adi: string;
  telefon: string;
  email: string | null;
  status: ListingStatus;
  manage_token: string;
  agreement_requested_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Public-safe: phone/email null when anlasildi */
export type PublicListing = Omit<Listing, "manage_token" | "telefon" | "email"> & {
  telefon: string | null;
  email: string | null;
};
```

- [ ] **Step 2: Zod schemas**

```ts
// lib/validations/listing.ts
import { z } from "zod";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import {
  DAIRE_SECENEKLERI,
  KAT_SECENEKLERI,
  ODEME_TERCIHLERI,
  LISTING_STATUSES,
} from "@/lib/constants/listing";
import { normalizeTrPhone } from "@/lib/phone";

export const createListingSchema = z.object({
  ilce: z.string().refine(isValidIstanbulIlce, "Geçerli bir İstanbul ilçesi seçin"),
  mahalle: z.string().trim().max(120).optional().nullable(),
  kat_sayisi: z.enum(KAT_SECENEKLERI),
  daire_sayisi: z.enum(DAIRE_SECENEKLERI),
  odeme_tercihi: z.enum(ODEME_TERCIHLERI),
  aciklama: z.string().trim().min(20, "En az 20 karakter").max(2000),
  iletisim_adi: z.string().trim().min(2).max(80),
  telefon: z
    .string()
    .transform((v, ctx) => {
      const n = normalizeTrPhone(v);
      if (!n) {
        ctx.addIssue({ code: "custom", message: "Geçerli bir cep telefonu girin" });
        return z.NEVER;
      }
      return n;
    }),
  email: z.string().email().optional().nullable().or(z.literal("")),
});

export const updateListingByOwnerSchema = createListingSchema.partial().extend({
  request_agreement: z.boolean().optional(),
});

export const adminUpdateListingSchema = z.object({
  status: z.enum(LISTING_STATUSES).optional(),
  ilce: z.string().refine(isValidIstanbulIlce).optional(),
  mahalle: z.string().trim().max(120).nullable().optional(),
  kat_sayisi: z.enum(KAT_SECENEKLERI).optional(),
  daire_sayisi: z.enum(DAIRE_SECENEKLERI).optional(),
  odeme_tercihi: z.enum(ODEME_TERCIHLERI).optional(),
  aciklama: z.string().trim().min(20).max(2000).optional(),
  iletisim_adi: z.string().trim().min(2).max(80).optional(),
  telefon: z.string().optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
```

- [ ] **Step 3: Commit**

```bash
git add types/listing.ts lib/validations/listing.ts
git commit -m "feat: add listing types and zod validation"
```

---

### Task 5: Supabase migration

**Files:**
- Create: `supabase/migrations/001_listings.sql`
- Create: `supabase/README.md` (nasıl uygulanır)

- [ ] **Step 1: Write SQL**

```sql
-- supabase/migrations/001_listings.sql

create extension if not exists "pgcrypto";

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  ilce text not null,
  mahalle text,
  kat_sayisi text not null,
  daire_sayisi text not null,
  odeme_tercihi text not null check (odeme_tercihi in (
    'kat_karsiligi', 'hakedis', 'pesin', 'diger', 'belirsiz'
  )),
  aciklama text not null,
  iletisim_adi text not null,
  telefon text not null,
  email text,
  status text not null default 'incelemede' check (status in (
    'incelemede', 'yayinda', 'teklif_saglaniyor', 'anlasildi', 'kaldirildi'
  )),
  manage_token text not null unique,
  agreement_requested_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_idx on public.listings (status);
create index listings_ilce_idx on public.listings (ilce);
create index listings_created_at_idx on public.listings (created_at desc);
create index listings_agreement_req_idx on public.listings (agreement_requested_at)
  where agreement_requested_at is not null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- Public view: hide contact when anlasildi; never expose manage_token
create or replace view public.listings_public as
select
  id,
  slug,
  ilce,
  mahalle,
  kat_sayisi,
  daire_sayisi,
  odeme_tercihi,
  aciklama,
  iletisim_adi,
  case when status = 'anlasildi' then null else telefon end as telefon,
  case when status = 'anlasildi' then null else email end as email,
  status,
  published_at,
  created_at,
  updated_at
from public.listings
where status in ('yayinda', 'teklif_saglaniyor', 'anlasildi');

alter table public.listings enable row level security;

-- Anon/authenticated: only public view is intended for client reads.
-- Direct table select denied for anon.
revoke all on public.listings from anon, authenticated;
grant select on public.listings_public to anon, authenticated;

-- Writes only via service role (Next.js server)
```

- [ ] **Step 2: Document apply steps in `supabase/README.md`**

```md
# Supabase

1. https://supabase.com üzerinde ücretsiz proje oluştur (region: Frankfurt tercih).
2. SQL Editor → `migrations/001_listings.sql` içeriğini çalıştır.
3. Project Settings → API: URL, anon key, service_role key kopyala → `.env.local`.
```

- [ ] **Step 3: Commit**

```bash
git add supabase
git commit -m "feat: add listings schema, public view, and RLS baseline"
```

---

### Task 6: Supabase clients + listing queries

**Files:**
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/admin.ts`
- Create: `lib/listings/queries.ts`
- Create: `lib/listings/mutations.ts`

- [ ] **Step 1: Clients**

```ts
// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase anon env");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

```ts
// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service env");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

- [ ] **Step 2: Queries**

```ts
// lib/listings/queries.ts
import { createAnonClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import type { PublicListing, Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";

export async function getPublicListings(ilce?: string): Promise<PublicListing[]> {
  const supabase = createAnonClient();
  let q = supabase
    .from("listings_public")
    .select("*")
    .order("published_at", { ascending: false });
  if (ilce) q = q.eq("ilce", ilce);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PublicListing[];
}

export async function getPublicListingBySlug(slug: string): Promise<PublicListing | null> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("listings_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as PublicListing | null;
}

export async function getListingByManageToken(token: string): Promise<Listing | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("manage_token", token)
    .maybeSingle();
  if (error) throw error;
  return data as Listing | null;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Listing | null;
}

export async function getAdminListings(filter?: {
  status?: ListingStatus;
}): Promise<Listing[]> {
  const supabase = createServiceClient();
  let q = supabase.from("listings").select("*").order("created_at", { ascending: false });
  if (filter?.status) q = q.eq("status", filter.status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Listing[];
}
```

```ts
// lib/listings/mutations.ts
import { createServiceClient } from "@/lib/supabase/admin";
import type { CreateListingInput } from "@/lib/validations/listing";
import { buildListingSlug, randomShortId } from "@/lib/slug";
import type { Listing, ListingStatus } from "@/types/listing";
import { randomBytes } from "crypto";

export async function createListing(
  input: CreateListingInput
): Promise<{ listing: Listing; manageUrlPath: string }> {
  const supabase = createServiceClient();
  const shortId = randomShortId(4);
  const slug = buildListingSlug({
    ilce: input.ilce,
    katSayisi: input.kat_sayisi,
    daireSayisi: input.daire_sayisi,
    odemeTercihi: input.odeme_tercihi,
    shortId,
  });
  const manage_token = randomBytes(24).toString("base64url");
  const email =
    input.email && String(input.email).trim() !== "" ? String(input.email) : null;

  const { data, error } = await supabase
    .from("listings")
    .insert({
      slug,
      ilce: input.ilce,
      mahalle: input.mahalle?.trim() || null,
      kat_sayisi: input.kat_sayisi,
      daire_sayisi: input.daire_sayisi,
      odeme_tercihi: input.odeme_tercihi,
      aciklama: input.aciklama,
      iletisim_adi: input.iletisim_adi,
      telefon: input.telefon,
      email,
      status: "incelemede",
      manage_token,
    })
    .select("*")
    .single();

  if (error) throw error;
  return {
    listing: data as Listing,
    manageUrlPath: `/yonet/${manage_token}`,
  };
}

export async function updateListingByToken(
  token: string,
  patch: Record<string, unknown>
): Promise<Listing> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("listings")
    .update(patch)
    .eq("manage_token", token)
    .select("*")
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function adminUpdateListing(
  id: string,
  patch: Record<string, unknown>
): Promise<Listing> {
  const supabase = createServiceClient();
  if (patch.status === "yayinda" && !patch.published_at) {
    patch.published_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("listings")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Listing;
}
```

Fix type import: `ListingStatus` is in `lib/constants/listing`, not types — in mutations use:

```ts
import type { Listing } from "@/types/listing";
import type { ListingStatus } from "@/lib/constants/listing";
```

(Remove wrong import from mutations if copied.)

- [ ] **Step 3: Commit**

```bash
git add lib/supabase lib/listings
git commit -m "feat: add Supabase clients and listing data access"
```

---

### Task 7: UI primitives + layout (mobil app hissi)

**Files:**
- Create: `app/globals.css` (refine)
- Create: `components/layout/SiteHeader.tsx`
- Create: `components/layout/BottomCta.tsx`
- Create: `components/layout/AppShell.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: App shell**

Temiz, profesyonel palet: arka plan `#F7F6F3`, metin `#0F172A`, accent `#0B6E4F` (güven/yeşil-teal; mor gradient yok).

```tsx
// components/layout/AppShell.tsx
import { SiteHeader } from "./SiteHeader";
import { BottomCta } from "./BottomCta";

export function AppShell({
  children,
  showBottomCta = true,
}: {
  children: React.ReactNode;
  showBottomCta?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-[#F7F6F3] text-slate-900">
      <SiteHeader />
      <main className={`mx-auto w-full max-w-lg px-4 pb-28 pt-4 ${showBottomCta ? "" : "pb-8"}`}>
        {children}
      </main>
      {showBottomCta ? <BottomCta /> : null}
    </div>
  );
}
```

```tsx
// components/layout/SiteHeader.tsx
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F7F6F3]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          kentsele<span className="text-[#0B6E4F]">.ist</span>
        </Link>
        <Link
          href="/ilan-ver"
          className="rounded-full bg-[#0B6E4F] px-3 py-1.5 text-sm font-medium text-white"
        >
          İlan ver
        </Link>
      </div>
    </header>
  );
}
```

```tsx
// components/layout/BottomCta.tsx
import Link from "next/link";

export function BottomCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-lg gap-2 p-3">
        <Link
          href="/ilan-ver"
          className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0B6E4F] text-sm font-semibold text-white"
        >
          Ücretsiz ilan ver
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Root layout metadata (TR)**

```tsx
// app/layout.tsx — metadata
export const metadata = {
  title: {
    default: "kentsele.ist — İstanbul Kentsel Dönüşüm İlanları",
    template: "%s · kentsele.ist",
  },
  description:
    "İstanbul kentsel dönüşüm ilanları. Malikler ilan verir, müteahhitler teklif için arar.",
};
```

- [ ] **Step 3: Commit**

```bash
git add components/layout app/layout.tsx app/globals.css
git commit -m "feat: add mobile-first app shell layout"
```

---

### Task 8: İlan kartı, badge, iletişim — public liste + detay

**Files:**
- Create: `components/ilan/StatusBadge.tsx`
- Create: `components/ilan/ListingCard.tsx`
- Create: `components/ilan/IlceFilter.tsx`
- Create: `components/ilan/ContactActions.tsx`
- Create: `app/page.tsx`
- Create: `app/ilan/[slug]/page.tsx`
- Create: `app/ilanlar/page.tsx` (re-export or redirect to `/`)

- [ ] **Step 1: Components**

```tsx
// components/ilan/StatusBadge.tsx
import { STATUS_LABELS, type ListingStatus } from "@/lib/constants/listing";

const styles: Partial<Record<ListingStatus, string>> = {
  yayinda: "bg-emerald-50 text-emerald-800",
  teklif_saglaniyor: "bg-amber-50 text-amber-900",
  anlasildi: "bg-slate-100 text-slate-600",
  incelemede: "bg-sky-50 text-sky-900",
  kaldirildi: "bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100"}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
```

```tsx
// components/ilan/ListingCard.tsx
import Link from "next/link";
import type { PublicListing } from "@/types/listing";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";
import { StatusBadge } from "./StatusBadge";

export function ListingCard({ listing }: { listing: PublicListing }) {
  return (
    <Link
      href={`/ilan/${listing.slug}`}
      className="block rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition active:scale-[0.99]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {listing.ilce}
            {listing.mahalle ? ` · ${listing.mahalle}` : ""}
          </p>
          <p className="text-xs text-slate-500">
            {listing.kat_sayisi} kat · {listing.daire_sayisi} daire ·{" "}
            {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
          </p>
        </div>
        <StatusBadge status={listing.status} />
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{listing.aciklama}</p>
    </Link>
  );
}
```

```tsx
// components/ilan/IlceFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";

export function IlceFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("ilce") ?? "";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => router.push("/")}
        className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
          !current ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-black/5"
        }`}
      >
        Tümü
      </button>
      {ISTANBUL_ILCELER.map((ilce) => (
        <button
          key={ilce}
          type="button"
          onClick={() => router.push(`/?ilce=${encodeURIComponent(ilce)}`)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
            current === ilce
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-black/5"
          }`}
        >
          {ilce}
        </button>
      ))}
    </div>
  );
}
```

```tsx
// components/ilan/ContactActions.tsx
import { formatPhoneDisplay, toTelHref, toWhatsAppUrl } from "@/lib/phone";

export function ContactActions({
  telefon,
  anlasildi,
}: {
  telefon: string | null;
  anlasildi: boolean;
}) {
  if (anlasildi || !telefon) {
    return (
      <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        Bu ilan için anlaşma sağlandı. İletişim bilgisi kapalı.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={toTelHref(telefon)}
        className="flex h-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white"
      >
        Ara · {formatPhoneDisplay(telefon)}
      </a>
      <a
        href={toWhatsAppUrl(telefon)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center rounded-2xl bg-[#25D366] text-sm font-semibold text-white"
      >
        WhatsApp
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Home page**

```tsx
// app/page.tsx
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ilan/ListingCard";
import { IlceFilter } from "@/components/ilan/IlceFilter";
import { getPublicListings } from "@/lib/listings/queries";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ ilce?: string }>;
}) {
  const sp = await searchParams;
  const ilce =
    sp.ilce && isValidIstanbulIlce(sp.ilce) ? sp.ilce : undefined;
  let listings = [];
  let errorMsg: string | null = null;
  try {
    listings = await getPublicListings(ilce);
  } catch {
    errorMsg = "İlanlar yüklenemedi. Supabase yapılandırmasını kontrol edin.";
  }

  return (
    <AppShell>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          İstanbul kentsel dönüşüm ilanları
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Malikler ilan verir; müteahhitler ücretsiz inceler ve arar.
        </p>
      </section>
      <Suspense fallback={null}>
        <IlceFilter />
      </Suspense>
      <div className="mt-4 flex flex-col gap-3">
        {errorMsg ? (
          <p className="text-sm text-rose-700">{errorMsg}</p>
        ) : listings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-slate-500">
            Bu filtrede henüz ilan yok. İlk ilanı sen ver.
          </p>
        ) : (
          listings.map((l) => <ListingCard key={l.id} listing={l} />)
        )}
      </div>
    </AppShell>
  );
}
```

- [ ] **Step 3: Detail page**

```tsx
// app/ilan/[slug]/page.tsx
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ilan/StatusBadge";
import { ContactActions } from "@/components/ilan/ContactActions";
import { getPublicListingBySlug } from "@/lib/listings/queries";
import { ODEME_LABELS, type OdemeTercihi } from "@/lib/constants/listing";

export default async function IlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);
  if (!listing) notFound();

  return (
    <AppShell showBottomCta={false}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">İstanbul · {listing.ilce}</p>
        <StatusBadge status={listing.status} />
      </div>
      <h1 className="text-xl font-semibold">
        {listing.kat_sayisi} kat · {listing.daire_sayisi} daire
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {ODEME_LABELS[listing.odeme_tercihi as OdemeTercihi]}
        {listing.mahalle ? ` · ${listing.mahalle}` : ""}
      </p>
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-4">
        <h2 className="text-sm font-semibold">İhtiyaç detayı</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {listing.aciklama}
        </p>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          {listing.iletisim_adi}
        </p>
        <ContactActions
          telefon={listing.telefon}
          anlasildi={listing.status === "anlasildi"}
        />
      </div>
    </AppShell>
  );
}
```

```tsx
// app/ilanlar/page.tsx
import { redirect } from "next/navigation";

export default function IlanlarPage() {
  redirect("/");
}
```

- [ ] **Step 4: Manual check**

```bash
npm run dev
```

Env yoksa empty/error state görünmeli; seed sonrası kartlar.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/ilan app/ilanlar components/ilan
git commit -m "feat: public listing feed and detail with district filter"
```

---

### Task 9: İlan ver wizard + POST API

**Files:**
- Create: `components/ilan-ver/IlanVerWizard.tsx`
- Create: `app/ilan-ver/page.tsx`
- Create: `app/ilan-ver/basarili/page.tsx`
- Create: `app/api/ilanlar/route.ts`

- [ ] **Step 1: API route**

```ts
// app/api/ilanlar/route.ts
import { NextResponse } from "next/server";
import { createListingSchema } from "@/lib/validations/listing";
import { createListing } from "@/lib/listings/mutations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { listing, manageUrlPath } = await createListing(parsed.data);
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    return NextResponse.json({
      id: listing.id,
      slug: listing.slug,
      managePath: manageUrlPath,
      manageUrl: site ? `${site}${manageUrlPath}` : manageUrlPath,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Wizard (client)**

Tek dosyada adım state: 0 ilçe, 1 kat, 2 daire, 3 ödeme, 4 açıklama, 5 iletişim.

```tsx
// components/ilan-ver/IlanVerWizard.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import {
  DAIRE_SECENEKLERI,
  KAT_SECENEKLERI,
  ODEME_LABELS,
  ODEME_TERCIHLERI,
  type OdemeTercihi,
} from "@/lib/constants/listing";

const STEPS = 6;

export function IlanVerWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    ilce: "",
    mahalle: "",
    kat_sayisi: "",
    daire_sayisi: "",
    odeme_tercihi: "" as OdemeTercihi | "",
    aciklama: "",
    iletisim_adi: "",
    telefon: "",
    email: "",
  });

  const progress = useMemo(() => ((step + 1) / STEPS) * 100, [step]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ilanlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          mahalle: form.mahalle || null,
          email: form.email || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Formu kontrol edip tekrar dene.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem(
        "kentsele_manage",
        JSON.stringify({ managePath: data.managePath, manageUrl: data.manageUrl })
      );
      router.push("/ilan-ver/basarili");
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  function next() {
    if (step === 0 && !form.ilce) return setError("İlçe seçin");
    if (step === 1 && !form.kat_sayisi) return setError("Kat seçin");
    if (step === 2 && !form.daire_sayisi) return setError("Daire seçin");
    if (step === 3 && !form.odeme_tercihi) return setError("Ödeme tercihi seçin");
    if (step === 4 && form.aciklama.trim().length < 20)
      return setError("En az 20 karakter yazın");
    if (step === 5) return submit();
    setError(null);
    setStep((s) => s + 1);
  }

  return (
    <div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full bg-[#0B6E4F] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === 0 && (
        <div>
          <h1 className="text-xl font-semibold">İlçe seçin</h1>
          <p className="mt-1 text-sm text-slate-600">Yalnızca İstanbul · 39 ilçe</p>
          <div className="mt-4 max-h-[50vh] space-y-1 overflow-y-auto">
            {ISTANBUL_ILCELER.map((ilce) => (
              <button
                key={ilce}
                type="button"
                onClick={() => setForm((f) => ({ ...f, ilce }))}
                className={`flex w-full rounded-xl px-3 py-3 text-left text-sm ${
                  form.ilce === ilce ? "bg-[#0B6E4F] text-white" : "bg-white border border-black/5"
                }`}
              >
                {ilce}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
            placeholder="Mahalle (opsiyonel)"
            value={form.mahalle}
            onChange={(e) => setForm((f) => ({ ...f, mahalle: e.target.value }))}
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl font-semibold">Kaç kat inşa edilecek?</h1>
          <p className="mt-1 text-sm text-slate-600">Zemin altı katlar dahil</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {KAT_SECENEKLERI.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setForm((f) => ({ ...f, kat_sayisi: k }))}
                className={`rounded-xl py-3 text-sm font-medium ${
                  form.kat_sayisi === k ? "bg-[#0B6E4F] text-white" : "bg-white border border-black/5"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-semibold">Binada kaç daire olacak?</h1>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {DAIRE_SECENEKLERI.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((f) => ({ ...f, daire_sayisi: d }))}
                className={`rounded-xl py-3 text-sm font-medium ${
                  form.daire_sayisi === d ? "bg-[#0B6E4F] text-white" : "bg-white border border-black/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-xl font-semibold">Ödeme tercihiniz nedir?</h1>
          <div className="mt-4 space-y-2">
            {ODEME_TERCIHLERI.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setForm((f) => ({ ...f, odeme_tercihi: o }))}
                className={`flex w-full rounded-xl px-3 py-3 text-left text-sm ${
                  form.odeme_tercihi === o ? "bg-[#0B6E4F] text-white" : "bg-white border border-black/5"
                }`}
              >
                {ODEME_LABELS[o]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1 className="text-xl font-semibold">İhtiyaç detayı</h1>
          <textarea
            className="mt-4 min-h-40 w-full rounded-2xl border border-black/10 bg-white p-3 text-sm"
            placeholder="Ada/parsel, mevcut durum, beklenti..."
            value={form.aciklama}
            onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
          />
        </div>
      )}

      {step === 5 && (
        <div>
          <h1 className="text-xl font-semibold">İletişim</h1>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="Ad soyad"
              value={form.iletisim_adi}
              onChange={(e) => setForm((f) => ({ ...f, iletisim_adi: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="Cep telefonu"
              inputMode="tel"
              value={form.telefon}
              onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
            />
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"
              placeholder="E-posta (opsiyonel)"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

      <div className="mt-8 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="h-12 flex-1 rounded-2xl border border-black/10 bg-white text-sm font-medium"
          >
            Geri
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={next}
          className="h-12 flex-[2] rounded-2xl bg-[#0B6E4F] text-sm font-semibold text-white disabled:opacity-60"
        >
          {step === 5 ? (loading ? "Gönderiliyor…" : "Gönder") : "Devam"}
        </button>
      </div>
    </div>
  );
}
```

```tsx
// app/ilan-ver/page.tsx
import { AppShell } from "@/components/layout/AppShell";
import { IlanVerWizard } from "@/components/ilan-ver/IlanVerWizard";

export default function IlanVerPage() {
  return (
    <AppShell showBottomCta={false}>
      <IlanVerWizard />
    </AppShell>
  );
}
```

```tsx
// app/ilan-ver/basarili/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function BasariliPage() {
  const [managePath, setManagePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("kentsele_manage");
    if (raw) {
      const parsed = JSON.parse(raw) as { managePath: string };
      setManagePath(parsed.managePath);
    }
  }, []);

  return (
    <AppShell showBottomCta={false}>
      <h1 className="text-xl font-semibold">İlanın alındı</h1>
      <p className="mt-2 text-sm text-slate-600">
        İnceleme sonrası teyit için aranabilirsin. Yayınlanınca listede görünür.
      </p>
      {managePath && (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-4">
          <p className="text-sm font-medium">Yönetim linkin (sakla)</p>
          <p className="mt-2 break-all text-xs text-slate-600">{managePath}</p>
          <button
            type="button"
            className="mt-3 h-11 w-full rounded-xl bg-slate-900 text-sm font-medium text-white"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}${managePath}`
              );
              setCopied(true);
            }}
          >
            {copied ? "Kopyalandı" : "Linki kopyala"}
          </button>
          <Link
            href={managePath}
            className="mt-2 flex h-11 items-center justify-center text-sm font-medium text-[#0B6E4F]"
          >
            İlanımı yönet
          </Link>
        </div>
      )}
      <Link href="/" className="mt-6 block text-center text-sm text-slate-500">
        Ana sayfaya dön
      </Link>
    </AppShell>
  );
}
```

- [ ] **Step 3: Manual E2E**

Form doldur → success → DB’de `incelemede` satır.

- [ ] **Step 4: Commit**

```bash
git add app/ilan-ver app/api/ilanlar components/ilan-ver
git commit -m "feat: multi-step listing form and create API"
```

---

### Task 10: Malik paneli `/yonet/[token]`

**Files:**
- Create: `app/yonet/[token]/page.tsx`
- Create: `components/yonet/OwnerPanel.tsx`
- Create: `app/api/yonet/[token]/route.ts`

- [ ] **Step 1: API**

```ts
// app/api/yonet/[token]/route.ts
import { NextResponse } from "next/server";
import { getListingByManageToken } from "@/lib/listings/queries";
import { updateListingByToken } from "@/lib/listings/mutations";
import { updateListingByOwnerSchema } from "@/lib/validations/listing";
import { normalizeTrPhone } from "@/lib/phone";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token } = await ctx.params;
  const existing = await getListingByManageToken(token);
  if (!existing || existing.status === "kaldirildi") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateListingByOwnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { ...parsed.data };
  delete patch.request_agreement;
  if (typeof patch.telefon === "string") {
    const n = normalizeTrPhone(patch.telefon);
    if (!n) return NextResponse.json({ error: "phone" }, { status: 400 });
    patch.telefon = n;
  }
  if (parsed.data.request_agreement) {
    patch.agreement_requested_at = new Date().toISOString();
  }

  // Owner cannot set status
  delete patch.status;

  const listing = await updateListingByToken(token, patch);
  return NextResponse.json({ listing });
}
```

- [ ] **Step 2: OwnerPanel client form**

Server page loads listing by token; client form PATCHes fields + “Anlaşma sağlandı bildir” sets `request_agreement: true`. Show `STATUS_LABELS`. Disable edits if `kaldirildi`.

- [ ] **Step 3: Commit**

```bash
git add app/yonet app/api/yonet components/yonet
git commit -m "feat: owner manage link panel and agreement request"
```

---

### Task 11: Admin oturum + panel

**Files:**
- Create: `lib/auth/admin-session.ts`
- Create: `app/api/yonetim/login/route.ts`
- Create: `app/api/yonetim/logout/route.ts`
- Create: `app/api/yonetim/ilanlar/[id]/route.ts`
- Create: `app/yonetim/page.tsx`
- Create: `app/yonetim/ilanlar/page.tsx`
- Create: `app/yonetim/ilanlar/[id]/page.tsx`
- Create: `components/yonetim/*`

- [ ] **Step 1: Session helpers**

```ts
// lib/auth/admin-session.ts
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "kentsele_admin";

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function setAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET missing");
  const payload = `admin:${Date.now()}`;
  const token = `${payload}.${sign(payload, secret)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return password === expected;
  }
}
```

Note: `timingSafeEqual` requires equal length buffers — use sha256 hash compare for password instead if lengths differ:

```ts
export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = sign(password, process.env.ADMIN_SESSION_SECRET ?? "x");
  const b = sign(expected, process.env.ADMIN_SESSION_SECRET ?? "x");
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Login API + admin pages**

- POST `/api/yonetim/login` body `{ password }` → set cookie  
- POST `/api/yonetim/logout`  
- PATCH `/api/yonetim/ilanlar/[id]` with `adminUpdateListingSchema`; require `isAdminAuthenticated()`  
- List page: tabs/filters for `incelemede`, agreement requests (`agreement_requested_at` not null && status not anlasildi)  
- Detail: buttons **Yayınla**, **Teklif sağlanıyor**, **Anlaşıldı**, **Kaldır** + edit fields  

When status → `anlasildi`, clear is automatic via view (phone hidden). Optionally set `agreement_requested_at` null on confirm.

- [ ] **Step 3: Commit**

```bash
git add lib/auth app/yonetim app/api/yonetim components/yonetim
git commit -m "feat: admin session, listing moderation and status controls"
```

---

### Task 12: Polish, seed, README, build

**Files:**
- Create: `README.md`
- Create: `supabase/seed.sql` (optional sample listings after publish)
- Modify: metadata / empty states / not-found

- [ ] **Step 1: `app/not-found.tsx`** TR mesaj  
- [ ] **Step 2: README** — env, migration, `npm run dev`, admin login  
- [ ] **Step 3: Run full test + build**

```bash
npm test
npm run build
```

Expected: tests pass; build succeeds (env may be needed at runtime only if not inlined).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "docs: README and polish for kentsele.ist MVP"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| İstanbul only + 39 ilçe | 2, 9 |
| Public liste + ilçe filtre | 8 |
| Türkçe URL’ler | 8–11 paths |
| Wizard form Armut-like | 9 |
| Admin onay sonrası yayın | 11 |
| Telefon public; anlaşıldı gizli | 5 view + 8 ContactActions |
| Malik `/yonet/token` düzenle + anlaşma bildir | 10 |
| Admin anlaşma onayı | 11 |
| Next.js + Supabase | 1, 5, 6 |
| Free-tier (no SMS) | 9 basarili copy link |
| Mobile app feel | 7 |

---

## Self-review notes

- Placeholder yok; sabit 39 ilçe listesi kodda.
- `ListingStatus` import path: `lib/constants/listing` (mutations/queries).
- Password compare: equal-length hash (Task 11 note).
- `randomBytes` Node `crypto` — API routes only (not edge) unless switch to Web Crypto.
- Prefer Node runtime for admin/owner APIs that use `crypto` + service role.
