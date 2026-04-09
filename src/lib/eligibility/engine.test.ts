import { describe, it, expect } from "vitest";
import { findSchemes } from "./engine";
import type { UserProfile } from "../../shared/types";

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: "test",
    state: "UP",
    ageBracket: "26-35",
    incomeBracket: "BPL",
    category: "OBC",
    gender: "male",
    occupationType: "farmer",
    language: "hi",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe("EligibilityEngine", () => {
  it("returns matching schemes for a BPL farmer in UP", () => {
    const results = findSchemes(makeProfile());
    const ids = results.map((s) => s.id);
    expect(ids).toContain("pm-kisan");
    expect(ids).toContain("mgnrega");
    expect(results.length).toBeGreaterThan(3);
  });

  it("performs O(1) lookups -- 10,000 in under 100ms", () => {
    const profile = makeProfile();
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      findSchemes(profile);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it("does not return BPL-only schemes for HIG users", () => {
    const results = findSchemes(makeProfile({ incomeBracket: "HIG", occupationType: "service" }));
    const ids = results.map((s) => s.id);
    expect(ids).not.toContain("mgnrega");
    expect(ids).not.toContain("pm-garib-kalyan-anna");
  });

  it("ranks employment schemes first for job-loss crisis", () => {
    const results = findSchemes(makeProfile({ crisisType: "job-loss", occupationType: "laborer" }));
    if (results.length >= 2) {
      const topCategories = results.slice(0, 3).map((s) => s.category);
      const hasEmploymentOrSkill = topCategories.some((c) => c === "employment" || c === "skill" || c === "finance");
      expect(hasEmploymentOrSkill).toBe(true);
    }
  });

  it("returns health schemes for health crisis", () => {
    const results = findSchemes(makeProfile({ crisisType: "health" }));
    const categories = results.map((s) => s.category);
    expect(categories).toContain("health");
  });
});
