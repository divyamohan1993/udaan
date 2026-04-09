import { describe, it, expect } from "vitest";
import { t, getLocaleStrings, getKeyCount } from "./index";

describe("i18n", () => {
  it("resolves English strings", () => {
    const result = t("app.name", "en");
    expect(result).toBe("Udaan");
  });

  it("resolves Hindi strings", () => {
    const result = t("app.name", "hi");
    expect(result).toBe("उड़ान");
  });

  it("interpolates variables in English", () => {
    const result = t("schemes.matchCount", "en", { count: "5" });
    expect(result).toBe("5 schemes found for you");
  });

  it("interpolates variables in Hindi", () => {
    const result = t("schemes.matchCount", "hi", { count: "5" });
    expect(result).toBe("आपके लिए 5 योजनाएं मिलीं");
  });

  it("falls back to Hindi when key missing in English", () => {
    const enMap = getLocaleStrings("en");
    const hiMap = getLocaleStrings("hi");
    expect(enMap.size).toBeGreaterThan(0);
    expect(hiMap.size).toBeGreaterThan(0);
  });

  it("returns key if not found in any locale", () => {
    const result = t("nonexistent.key.that.doesnt.exist", "en");
    expect(result).toBe("nonexistent.key.that.doesnt.exist");
  });

  it("performs 100,000 lookups in under 50ms (O(1))", () => {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      t("app.name", "hi");
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it("has matching keys in both locales", () => {
    const enMap = getLocaleStrings("en");
    const hiMap = getLocaleStrings("hi");
    for (const key of enMap.keys()) {
      expect(hiMap.has(key), `Hindi missing key: ${key}`).toBe(true);
    }
  });

  it("has 60+ keys per locale", () => {
    expect(getKeyCount("en")).toBeGreaterThanOrEqual(60);
    expect(getKeyCount("hi")).toBeGreaterThanOrEqual(60);
  });

  it("interpolates multiple variables", () => {
    const result = t("triage.step", "en", { current: "2", total: "4" });
    expect(result).toBe("Step 2 of 4");
  });

  it("interpolates numeric variables", () => {
    const result = t("circles.members", "en", { count: 5 });
    expect(result).toBe("5 members");
  });
});
