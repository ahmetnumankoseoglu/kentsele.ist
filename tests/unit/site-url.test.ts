import { afterEach, describe, expect, it, vi } from "vitest";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns production URL when env is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const { getSiteUrl, PRODUCTION_SITE_URL } = await import("@/lib/seo/site");
    expect(getSiteUrl()).toBe(PRODUCTION_SITE_URL);
  });

  it("ignores localhost and falls back to production", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const { getSiteUrl, PRODUCTION_SITE_URL } = await import("@/lib/seo/site");
    expect(getSiteUrl()).toBe(PRODUCTION_SITE_URL);
  });

  it("accepts a real public URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kentsele.ist/");
    const { getSiteUrl } = await import("@/lib/seo/site");
    expect(getSiteUrl()).toBe("https://kentsele.ist");
  });

  it("ignores 127.0.0.1", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://127.0.0.1:3000");
    const { getSiteUrl, PRODUCTION_SITE_URL } = await import("@/lib/seo/site");
    expect(getSiteUrl()).toBe(PRODUCTION_SITE_URL);
  });
});
