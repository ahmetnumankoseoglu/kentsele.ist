import { describe, expect, it } from "vitest";
import {
  canOwnerEditListing,
  emailsMatch,
} from "@/lib/listings/ownership";

describe("emailsMatch", () => {
  it("matches case-insensitively and trims", () => {
    expect(emailsMatch("Foo@Bar.com", "foo@bar.com")).toBe(true);
    expect(emailsMatch("  a@b.co ", "a@b.co")).toBe(true);
    expect(emailsMatch(null, "a@b.co")).toBe(false);
    expect(emailsMatch("a@b.co", "other@b.co")).toBe(false);
  });
});

describe("canOwnerEditListing", () => {
  it("allows by email even without owner_user_id", () => {
    expect(
      canOwnerEditListing({
        profileId: "u1",
        userEmail: "malik@example.com",
        listing: { email: "malik@example.com", owner_user_id: null },
      })
    ).toBe(true);
  });

  it("denies mismatched email", () => {
    expect(
      canOwnerEditListing({
        profileId: "u1",
        userEmail: "other@example.com",
        listing: { email: "malik@example.com", owner_user_id: null },
      })
    ).toBe(false);
  });
});
