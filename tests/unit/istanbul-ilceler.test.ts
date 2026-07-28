import { describe, it, expect } from "vitest";
import {
  ISTANBUL_ILCELER,
  isValidIstanbulIlce,
  ilceToSeoSlug,
  ilceFromSeoSlug,
  allSeoDistrictSlugs,
} from "@/lib/constants/istanbul-ilceler";

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

  it("builds SEO slugs like bayrampasa-kentsel-donusum", () => {
    expect(ilceToSeoSlug("Bayrampaşa")).toBe("bayrampasa-kentsel-donusum");
    expect(ilceToSeoSlug("Kadıköy")).toBe("kadikoy-kentsel-donusum");
    expect(ilceFromSeoSlug("bayrampasa-kentsel-donusum")).toBe("Bayrampaşa");
    expect(allSeoDistrictSlugs()).toHaveLength(39);
  });
});
