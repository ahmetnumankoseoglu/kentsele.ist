import { describe, expect, it } from "vitest";
import { ISTANBUL_ILCELER } from "@/lib/constants/istanbul-ilceler";
import {
  getMahallelerForIlce,
  isValidMahalleForIlce,
  totalIstanbulMahalleCount,
  ISTANBUL_MAHALLELER,
} from "@/lib/constants/istanbul-mahalleler";

describe("istanbul mahalleler", () => {
  it("covers all 39 ilce", () => {
    for (const ilce of ISTANBUL_ILCELER) {
      expect(ISTANBUL_MAHALLELER[ilce]?.length).toBeGreaterThan(0);
    }
  });

  it("Bayrampaşa has expected mahalles", () => {
    const m = getMahallelerForIlce("Bayrampaşa");
    expect(m).toContain("Altıntepsi");
    expect(m).toContain("Yıldırım");
    expect(m.length).toBe(11);
  });

  it("validates mahalle against ilce", () => {
    expect(isValidMahalleForIlce("Kadıköy", "Caferağa")).toBe(true);
    expect(isValidMahalleForIlce("Kadıköy", "Levent")).toBe(false);
  });

  it("has ~900+ mahalles citywide", () => {
    expect(totalIstanbulMahalleCount()).toBeGreaterThan(900);
  });
});
