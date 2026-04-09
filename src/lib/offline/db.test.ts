import { describe, it, expect, afterEach } from "vitest";
import { getDatabase, saveProfile, getProfile, cacheSchemes, getCachedSchemes, getEmergencyContacts, cacheEmergencyContacts, destroy } from "./db";
import type { UserProfile, Scheme, EmergencyContact } from "../../shared/types";

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

describe("Offline DB - Emergency Contacts (defense in depth)", () => {
  it("pre-seeds critical emergency contacts on first DB creation", async () => {
    await getDatabase(true);
    const contacts = await getEmergencyContacts();

    // Must have contacts from first load -- no empty state for emergencies
    expect(contacts.length).toBeGreaterThanOrEqual(5);

    // Must include the critical numbers
    const numbers = contacts.map((c) => c.number);
    expect(numbers).toContain("112");
    expect(numbers).toContain("108");
    expect(numbers).toContain("1800-599-0019");
    expect(numbers).toContain("181");
    expect(numbers).toContain("1098");
  });

  it("caches additional emergency contacts without losing critical ones", async () => {
    await getDatabase(true);

    const extra: EmergencyContact[] = [
      {
        id: "extra-food",
        name: "Food Helpline",
        nameHi: "खाद्य हेल्पलाइन",
        number: "14445",
        type: "food",
        state: "all",
        available: "9am-6pm",
      },
    ];

    await cacheEmergencyContacts(extra);
    const contacts = await getEmergencyContacts();

    // Original critical contacts still present
    expect(contacts.some((c) => c.number === "112")).toBe(true);
    // New contact also present
    expect(contacts.some((c) => c.number === "14445")).toBe(true);
  });

  it("never returns empty -- always has critical contacts", async () => {
    // getEmergencyContacts must always return data, whether from DB or hardcoded
    const contacts = await getEmergencyContacts();
    expect(contacts.length).toBeGreaterThanOrEqual(5);

    const numbers = contacts.map((c) => c.number);
    expect(numbers).toContain("112");
    expect(numbers).toContain("108");
    expect(numbers).toContain("1800-599-0019");
  });
});
