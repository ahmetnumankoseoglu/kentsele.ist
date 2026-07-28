import { describe, it, expect } from "vitest";
import {
  normalizeTrPhone,
  toWhatsAppUrl,
  formatPhoneDisplay,
  formatPhoneInput,
} from "@/lib/phone";

describe("normalizeTrPhone", () => {
  it("normalizes common TR formats to +90...", () => {
    expect(normalizeTrPhone("0532 123 45 67")).toBe("+905321234567");
    expect(normalizeTrPhone("5321234567")).toBe("+905321234567");
    expect(normalizeTrPhone("+90 532 123 45 67")).toBe("+905321234567");
  });

  it("returns null for invalid", () => {
    expect(normalizeTrPhone("123")).toBeNull();
  });
});

describe("formatPhoneInput", () => {
  it("formats as user types", () => {
    expect(formatPhoneInput("0532")).toBe("0532");
    expect(formatPhoneInput("0532123")).toBe("0532 123");
    expect(formatPhoneInput("05321234567")).toBe("0532 123 45 67");
    expect(formatPhoneInput("5321234567")).toBe("0532 123 45 67");
  });
});

describe("toWhatsAppUrl", () => {
  it("builds wa.me link without plus", () => {
    expect(toWhatsAppUrl("+905321234567")).toBe("https://wa.me/905321234567");
  });
});
