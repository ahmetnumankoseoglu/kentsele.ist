import { describe, it, expect } from "vitest";
import {
  parseDigitInput,
  sanitizeDigitInput,
} from "@/lib/utils/numeric-input";

describe("sanitizeDigitInput", () => {
  it("strips leading zeros so 05 becomes 5", () => {
    expect(sanitizeDigitInput("05")).toBe("5");
    expect(sanitizeDigitInput("0")).toBe("0");
    expect(sanitizeDigitInput("")).toBe("");
    expect(sanitizeDigitInput("00")).toBe("0");
    expect(sanitizeDigitInput("100")).toBe("100");
    expect(sanitizeDigitInput("a5b")).toBe("5");
  });
});

describe("parseDigitInput", () => {
  it("parses empty as fallback", () => {
    expect(parseDigitInput("", 0)).toBe(0);
    expect(parseDigitInput("12")).toBe(12);
  });
});
