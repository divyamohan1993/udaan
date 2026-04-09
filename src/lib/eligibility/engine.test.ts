import { describe, it, expect } from "vitest";
import { findSchemes, getIndexSize } from "./engine";
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
  it("returns PM-KISAN, MGNREGA, Ayushman Bharat for BPL farmer in UP", () => {
    const results = findSchemes(makeProfile());
    const ids = results.map((s) => s.id);
    expect(ids).toContain("pm-kisan");
    expect(ids).toContain("mgnrega");
    expect(ids).toContain("ayushman-bharat");
    expect(results.length).toBeGreaterThan(5);
  });

  it("performs O(1) lookups: 10,000 in under 100ms", () => {
    const profile = makeProfile();
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      findSchemes(profile);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it("does NOT return BPL-only schemes for HIG service worker", () => {
    const results = findSchemes(makeProfile({ incomeBracket: "HIG", occupationType: "service" }));
    const ids = results.map((s) => s.id);
    expect(ids).not.toContain("mgnrega");
    expect(ids).not.toContain("pm-garib-kalyan-anna");
    expect(ids).not.toContain("pm-awas-yojana-gramin");
    expect(ids).not.toContain("aay");
  });

  it("ranks employment schemes first for job-loss crisis", () => {
    const results = findSchemes(makeProfile({ crisisType: "job-loss", occupationType: "laborer" }));
    expect(results.length).toBeGreaterThan(0);
    // First few results should be employment, skill, or finance (from CRISIS_TO_SCHEME_CATEGORIES)
    const topCategories = results.slice(0, 5).map((s) => s.category);
    const hasRelevant = topCategories.some((c) =>
      c === "employment" || c === "skill" || c === "finance" || c === "insurance"
    );
    expect(hasRelevant).toBe(true);
    // Employment should appear before non-priority categories
    const firstEmploymentIdx = results.findIndex(s => s.category === "employment");
    const firstHealthIdx = results.findIndex(s => s.category === "health");
    if (firstEmploymentIdx >= 0 && firstHealthIdx >= 0) {
      expect(firstEmploymentIdx).toBeLessThan(firstHealthIdx);
    }
  });

  it("returns health schemes for health crisis", () => {
    const results = findSchemes(makeProfile({ crisisType: "health" }));
    const categories = results.map((s) => s.category);
    expect(categories).toContain("health");
    // Health should be ranked first
    expect(results[0].category).toBe("health");
  });

  it("has a non-empty pre-computed index", () => {
    expect(getIndexSize()).toBeGreaterThan(1000);
  });

  it("returns food schemes for no-food crisis", () => {
    const results = findSchemes(makeProfile({ crisisType: "no-food" }));
    const topCategories = results.slice(0, 5).map(s => s.category);
    expect(topCategories).toContain("food");
  });

  it("returns pension schemes for 60+ elderly BPL", () => {
    const results = findSchemes(makeProfile({ ageBracket: "60+", occupationType: "unemployed" }));
    const ids = results.map(s => s.id);
    expect(ids).toContain("nsap-ignoaps");
  });

  it("returns SC-specific scholarship for SC student", () => {
    const results = findSchemes(makeProfile({ category: "SC", occupationType: "student" }));
    const ids = results.map(s => s.id);
    expect(ids).toContain("scholarship-sc");
  });
});
