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
