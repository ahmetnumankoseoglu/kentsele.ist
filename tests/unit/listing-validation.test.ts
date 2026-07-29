import { describe, expect, it } from "vitest";
import { createListingSchema } from "@/lib/validations/listing";

const base = {
  ilce: "Kadıköy",
  mahalle: "Caferağa",
  ada: "100",
  parsel: "5",
  kat_sayisi: "5",
  daire_sayisi: "12",
  odeme_tercihi: "kat_karsiligi" as const,
  aciklama: "Bu bir test açıklamasıdır, en az yirmi karakter.",
  iletisim_adi: "Test Malik",
  telefon: "05321234567",
  email: "test@example.com",
};

describe("createListingSchema", () => {
  it("accepts free-form numeric kat/daire and belge flags", () => {
    const r = createListingSchema.safeParse({
      ...base,
      kat_sayisi: "11",
      daire_sayisi: "27",
      belge_aplikasyon: true,
      belge_imar_durum: false,
      belge_istikamet_roleve: true,
      belge_kot_kesit: false,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.kat_sayisi).toBe("11");
      expect(r.data.daire_sayisi).toBe("27");
      expect(r.data.belge_aplikasyon).toBe(true);
    }
  });

  it("rejects non-numeric kat", () => {
    const r = createListingSchema.safeParse({ ...base, kat_sayisi: "8+" });
    expect(r.success).toBe(false);
  });

  it("rejects zero daire", () => {
    const r = createListingSchema.safeParse({ ...base, daire_sayisi: "0" });
    expect(r.success).toBe(false);
  });

  it("accepts dukkan 0 and defaults missing dukkan to 0", () => {
    const withZero = createListingSchema.safeParse({
      ...base,
      dukkan_sayisi: "0",
    });
    expect(withZero.success).toBe(true);
    if (withZero.success) expect(withZero.data.dukkan_sayisi).toBe("0");

    const missing = createListingSchema.safeParse(base);
    expect(missing.success).toBe(true);
    if (missing.success) expect(missing.data.dukkan_sayisi).toBe("0");

    const shops = createListingSchema.safeParse({
      ...base,
      dukkan_sayisi: "3",
    });
    expect(shops.success).toBe(true);
    if (shops.success) expect(shops.data.dukkan_sayisi).toBe("3");
  });

  it("rejects mahalle not in ilce", () => {
    const r = createListingSchema.safeParse({
      ...base,
      mahalle: "OlmayanMahalle",
    });
    expect(r.success).toBe(false);
  });

  it("requires email and numeric ada/parsel", () => {
    expect(
      createListingSchema.safeParse({ ...base, email: "" }).success
    ).toBe(false);
    expect(
      createListingSchema.safeParse({ ...base, ada: "12A" }).success
    ).toBe(false);
    expect(
      createListingSchema.safeParse({ ...base, parsel: "" }).success
    ).toBe(false);
  });
});
