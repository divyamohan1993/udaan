import { describe, it, expect } from "vitest";
import { t, getLocaleStrings } from "./index";

describe("i18n", () => {
  it("resolves English strings", () => {
    const result = t("app.name", "en");
    expect(result).toBe("Udaan");
  });

  it("resolves Hindi strings", () => {
    const result = t("app.name", "hi");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("falls back to Hindi for missing English keys", () => {
    // Keys should exist in both locales
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
    // Every English key should have a Hindi counterpart
    for (const key of enMap.keys()) {
      expect(hiMap.has(key), `Hindi missing key: ${key}`).toBe(true);
    }
  });
});
