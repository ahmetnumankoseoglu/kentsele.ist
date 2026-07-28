import { describe, expect, it } from "vitest";
import { safeInternalPath } from "@/lib/auth/safe-next";

describe("safeInternalPath", () => {
  it("allows normal app paths", () => {
    expect(safeInternalPath("/hesabim")).toBe("/hesabim");
    expect(safeInternalPath("/yonet/abc123")).toBe("/yonet/abc123");
    expect(safeInternalPath("/ilanlar?ilce=Kadıköy")).toBe(
      "/ilanlar?ilce=Kadıköy"
    );
  });

  it("blocks open redirects", () => {
    expect(safeInternalPath("https://evil.com")).toBe("/hesabim");
    expect(safeInternalPath("//evil.com")).toBe("/hesabim");
    expect(safeInternalPath("javascript:alert(1)")).toBe("/hesabim");
    expect(safeInternalPath(null)).toBe("/hesabim");
  });

  it("uses custom fallback", () => {
    expect(safeInternalPath("//x", "/muteahhit")).toBe("/muteahhit");
  });
});
