import { describe, it, expect } from "vitest";
import {
  DESTEK_TUTARLARI,
  hesaplaYarisiBizden,
} from "@/lib/content/destek-tutarlari";

describe("Yarısı Bizden tutarları", () => {
  it("per-unit konut package is 1.875.000", () => {
    expect(DESTEK_TUTARLARI.konut.hibe).toBe(875_000);
    expect(DESTEK_TUTARLARI.konut.kredi).toBe(875_000);
    expect(DESTEK_TUTARLARI.konut.tasinma).toBe(125_000);
    expect(DESTEK_TUTARLARI.konut.toplamBirim).toBe(1_875_000);
  });

  it("per-unit is yeri package is 1.000.000", () => {
    expect(DESTEK_TUTARLARI.ticari.hibe).toBe(437_500);
    expect(DESTEK_TUTARLARI.ticari.kredi).toBe(437_500);
    expect(DESTEK_TUTARLARI.ticari.tasinma).toBe(125_000);
    expect(DESTEK_TUTARLARI.ticari.toplamBirim).toBe(1_000_000);
  });

  it("multiplies full package per unit including tasinma", () => {
    const one = hesaplaYarisiBizden(1, 1);
    expect(one.hibe).toBe(875_000 + 437_500);
    expect(one.kredi).toBe(875_000 + 437_500);
    expect(one.tasinma).toBe(125_000 + 125_000);
    expect(one.genelToplam).toBe(1_875_000 + 1_000_000);

    const multi = hesaplaYarisiBizden(3, 2);
    expect(multi.hibe).toBe(3 * 875_000 + 2 * 437_500);
    expect(multi.kredi).toBe(3 * 875_000 + 2 * 437_500);
    expect(multi.tasinma).toBe(5 * 125_000);
    expect(multi.genelToplam).toBe(3 * 1_875_000 + 2 * 1_000_000);
  });
});
