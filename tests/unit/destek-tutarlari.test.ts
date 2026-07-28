import { describe, it, expect } from "vitest";
import {
  DESTEK_TUTARLARI,
  hesaplaYarisiBizden,
} from "@/lib/content/destek-tutarlari";

describe("Yarısı Bizden tutarları", () => {
  it("matches announced konut package 1.875.000", () => {
    expect(DESTEK_TUTARLARI.konut.hibe).toBe(875_000);
    expect(DESTEK_TUTARLARI.konut.kredi).toBe(875_000);
    expect(DESTEK_TUTARLARI.konut.tasinma).toBe(125_000);
    expect(DESTEK_TUTARLARI.konut.toplamIlk).toBe(1_875_000);
    expect(DESTEK_TUTARLARI.konut.ekKonutKredi).toBe(1_750_000);
  });

  it("matches announced is yeri package 1.000.000", () => {
    expect(DESTEK_TUTARLARI.ticari.hibe).toBe(437_500);
    expect(DESTEK_TUTARLARI.ticari.kredi).toBe(437_500);
    expect(DESTEK_TUTARLARI.ticari.tasinma).toBe(125_000);
    expect(DESTEK_TUTARLARI.ticari.toplamIlk).toBe(1_000_000);
    expect(DESTEK_TUTARLARI.ticari.ekDukkanKredi).toBe(875_000);
  });

  it("calculates mixed building konut + ticari", () => {
    // 1 konut + 1 dükkân
    const one = hesaplaYarisiBizden(1, 1);
    expect(one.hibe).toBe(875_000 + 437_500);
    expect(one.kredi).toBe(875_000 + 437_500);
    expect(one.tasinma).toBe(125_000 + 125_000);
    expect(one.ekKredi).toBe(0);
    expect(one.genelToplam).toBe(1_875_000 + 1_000_000);

    // 3 konut + 2 ticari
    const multi = hesaplaYarisiBizden(3, 2);
    expect(multi.hibe).toBe(875_000 + 437_500);
    expect(multi.kredi).toBe(875_000 + 437_500);
    expect(multi.tasinma).toBe(250_000);
    expect(multi.ekKredi).toBe(2 * 1_750_000 + 1 * 875_000);
  });
});
