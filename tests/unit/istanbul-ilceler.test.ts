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
