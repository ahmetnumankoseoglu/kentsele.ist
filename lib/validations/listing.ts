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
