import { z } from "zod";
import { isValidIstanbulIlce } from "@/lib/constants/istanbul-ilceler";
import { isValidMahalleForIlce } from "@/lib/constants/istanbul-mahalleler";
import { ODEME_TERCIHLERI, LISTING_STATUSES } from "@/lib/constants/listing";
import { normalizeTrPhone } from "@/lib/phone";

/** Kat: pozitif tam sayı (string) */
const katSayisiSchema = z
  .union([z.string(), z.number()])
  .transform((v) => String(v).trim())
  .refine((v) => /^\d+$/.test(v), "Kat sayısı yalnızca rakam olmalı")
  .refine((v) => {
    const n = Number(v);
    return n >= 1 && n <= 99;
  }, "Kat sayısı en az 1 olmalı");

/** Daire: pozitif tam sayı */
const daireSayisiSchema = z
  .union([z.string(), z.number()])
  .transform((v) => String(v).trim())
  .refine((v) => /^\d+$/.test(v), "Daire sayısı yalnızca rakam olmalı")
  .refine((v) => {
    const n = Number(v);
    return n >= 1 && n <= 999;
  }, "Daire sayısı en az 1 olmalı");

/** Dükkan: 0 veya pozitif (yoksa 0) */
const dukkanSayisiSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || String(v).trim() === "") return "0";
    return String(v).trim();
  })
  .refine((v) => /^\d+$/.test(v), "Dükkan sayısı yalnızca rakam olmalı")
  .refine((v) => {
    const n = Number(v);
    return n >= 0 && n <= 999;
  }, "Dükkan sayısı 0–999 arası olmalı");

/** Ada / parsel: zorunlu, yalnızca rakam */
const adaParselRequired = z
  .union([z.string(), z.number()])
  .transform((v) => String(v).trim())
  .refine((v) => v.length > 0, "Bu alan zorunlu")
  .refine((v) => /^\d+$/.test(v), "Yalnızca rakam girin")
  .refine((v) => v.length <= 20, "En fazla 20 hane");

const adaParselOptionalUpdate = z
  .union([z.string(), z.number()])
  .transform((v) => String(v).trim())
  .refine((v) => v === "" || /^\d+$/.test(v), "Yalnızca rakam girin")
  .transform((v) => (v.length > 0 ? v : null))
  .optional()
  .nullable();

const belgeBool = z.boolean().optional().default(false);

export const createListingSchema = z
  .object({
    ilce: z
      .string()
      .refine(isValidIstanbulIlce, "Geçerli bir İstanbul ilçesi seçin"),
    mahalle: z.string().trim().min(1, "Mahalle seçin").max(120),
    ada: adaParselRequired,
    parsel: adaParselRequired,
    kat_sayisi: katSayisiSchema,
    daire_sayisi: daireSayisiSchema,
    dukkan_sayisi: dukkanSayisiSchema,
    odeme_tercihi: z.enum(ODEME_TERCIHLERI),
    aciklama: z.string().trim().min(20, "En az 20 karakter").max(2000),
    iletisim_adi: z.string().trim().min(2).max(80),
    telefon: z
      .string()
      .transform((v, ctx) => {
        const n = normalizeTrPhone(v);
        if (!n) {
          ctx.addIssue({
            code: "custom",
            message: "Geçerli bir cep telefonu girin",
          });
          return z.NEVER;
        }
        return n;
      }),
    email: z
      .string()
      .trim()
      .min(1, "E-posta zorunlu")
      .email("Geçerli bir e-posta girin")
      .max(120),
    belge_aplikasyon: belgeBool,
    belge_imar_durum: belgeBool,
    belge_istikamet_roleve: belgeBool,
    belge_kot_kesit: belgeBool,
  })
  .superRefine((data, ctx) => {
    if (!isValidMahalleForIlce(data.ilce, data.mahalle)) {
      ctx.addIssue({
        code: "custom",
        message: "Seçilen ilçeye ait geçerli bir mahalle seçin",
        path: ["mahalle"],
      });
    }
  });

export const updateListingByOwnerSchema = z
  .object({
    ilce: z
      .string()
      .refine(isValidIstanbulIlce, "Geçerli bir İstanbul ilçesi seçin")
      .optional(),
    mahalle: z.string().trim().min(1).max(120).nullable().optional(),
    ada: adaParselOptionalUpdate,
    parsel: adaParselOptionalUpdate,
    kat_sayisi: katSayisiSchema.optional(),
    daire_sayisi: daireSayisiSchema.optional(),
    dukkan_sayisi: dukkanSayisiSchema.optional(),
    odeme_tercihi: z.enum(ODEME_TERCIHLERI).optional(),
    aciklama: z.string().trim().min(20).max(2000).optional(),
    iletisim_adi: z.string().trim().min(2).max(80).optional(),
    telefon: z.string().optional(),
    email: z
      .string()
      .trim()
      .email("Geçerli bir e-posta girin")
      .max(120)
      .optional(),
    belge_aplikasyon: z.boolean().optional(),
    belge_imar_durum: z.boolean().optional(),
    belge_istikamet_roleve: z.boolean().optional(),
    belge_kot_kesit: z.boolean().optional(),
    request_agreement: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.ilce && data.mahalle && data.mahalle.trim()) {
      if (!isValidMahalleForIlce(data.ilce, data.mahalle)) {
        ctx.addIssue({
          code: "custom",
          message: "Seçilen ilçeye ait geçerli bir mahalle seçin",
          path: ["mahalle"],
        });
      }
    }
  });

export const adminUpdateListingSchema = z.object({
  status: z.enum(LISTING_STATUSES).optional(),
  ilce: z.string().refine(isValidIstanbulIlce).optional(),
  mahalle: z.string().trim().max(120).nullable().optional(),
  ada: adaParselOptionalUpdate,
  parsel: adaParselOptionalUpdate,
  kat_sayisi: katSayisiSchema.optional(),
  daire_sayisi: daireSayisiSchema.optional(),
  dukkan_sayisi: dukkanSayisiSchema.optional(),
  odeme_tercihi: z.enum(ODEME_TERCIHLERI).optional(),
  aciklama: z.string().trim().min(20).max(2000).optional(),
  iletisim_adi: z.string().trim().min(2).max(80).optional(),
  telefon: z.string().optional(),
  email: z
    .string()
    .trim()
    .email()
    .max(120)
    .nullable()
    .optional()
    .or(z.literal("")),
  belge_aplikasyon: z.boolean().optional(),
  belge_imar_durum: z.boolean().optional(),
  belge_istikamet_roleve: z.boolean().optional(),
  belge_kot_kesit: z.boolean().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
