import { describe, it, expect, afterEach } from "vitest";
import { getDatabase, saveProfile, getProfile, cacheSchemes, getCachedSchemes, destroy } from "./db";
import type { UserProfile, Scheme } from "../../shared/types";

afterEach(async () => {
  await destroy();
});

describe("Offline DB - Profile", () => {
  it("saves and retrieves a profile", async () => {
    const profile: UserProfile = {
      id: "test-user-1",
      state: "UP",
      ageBracket: "26-35",
      incomeBracket: "BPL",
      category: "OBC",
      gender: "male",
      occupationType: "laborer",
      language: "hi",
      crisisType: "job-loss",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveProfile(profile);
    const retrieved = await getProfile("test-user-1");

    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe("test-user-1");
    expect(retrieved!.state).toBe("UP");
    expect(retrieved!.ageBracket).toBe("26-35");
    expect(retrieved!.incomeBracket).toBe("BPL");
    expect(retrieved!.category).toBe("OBC");
    expect(retrieved!.gender).toBe("male");
    expect(retrieved!.occupationType).toBe("laborer");
    expect(retrieved!.language).toBe("hi");
  });

  it("returns null for nonexistent profile", async () => {
    // Force DB init with memory storage
    await getDatabase(true);
    const result = await getProfile("does-not-exist");
    expect(result).toBeNull();
  });

  it("upserts profile on duplicate save", async () => {
    const profile: UserProfile = {
      id: "test-user-2",
      state: "Bihar",
      ageBracket: "18-25",
      incomeBracket: "LIG",
      category: "SC",
      gender: "female",
      occupationType: "student",
      language: "en",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveProfile(profile);

    const updated = { ...profile, state: "MP" as const, updatedAt: Date.now() };
    await saveProfile(updated);

    const retrieved = await getProfile("test-user-2");
    expect(retrieved!.state).toBe("MP");
  });
});

describe("Offline DB - Scheme Caching", () => {
  it("caches and retrieves schemes", async () => {
    // Force memory storage
    await getDatabase(true);

    const schemes: Scheme[] = [
      {
        id: "test-scheme-1",
        name: "Test Scheme",
        nameHi: "परीक्षण योजना",
        ministry: "Test Ministry",
        description: "A test scheme",
        descriptionHi: "एक परीक्षण योजना",
        benefits: "Test benefits",
        benefitsHi: "परीक्षण लाभ",
        eligibility: {
          states: "all",
          ageBrackets: "all",
          incomeBrackets: ["BPL"],
          categories: "all",
          genders: "all",
          occupationTypes: "all",
        },
        applyUrl: "https://example.gov.in",
        applySteps: ["Step 1", "Step 2"],
        applyStepsHi: ["चरण 1", "चरण 2"],
        category: "employment",
        scope: "central",
      },
      {
        id: "test-scheme-2",
        name: "Another Scheme",
        nameHi: "एक और योजना",
        ministry: "Another Ministry",
        description: "Another test",
        descriptionHi: "एक और परीक्षण",
        benefits: "More benefits",
        benefitsHi: "अधिक लाभ",
        eligibility: {
          states: ["UP", "Bihar"],
          ageBrackets: ["18-25"],
          incomeBrackets: "all",
          categories: "all",
          genders: ["female"],
          occupationTypes: ["farmer"],
        },
        applyUrl: "https://example2.gov.in",
        applySteps: ["Apply online"],
        applyStepsHi: ["ऑनलाइन आवेदन करें"],
        category: "finance",
        scope: "central",
      },
    ];

    await cacheSchemes(schemes);
    const cached = await getCachedSchemes();

    expect(cached).toHaveLength(2);
    expect(cached.map((s) => s.id).sort()).toEqual(["test-scheme-1", "test-scheme-2"]);
  });

  it("returns empty array when no schemes cached", async () => {
    await getDatabase(true);
    const cached = await getCachedSchemes();
    expect(cached).toHaveLength(0);
  });
});
