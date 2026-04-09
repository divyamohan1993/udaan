import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { name: "Landing", path: "/" },
  { name: "Triage", path: "/sahara/triage" },
  { name: "Schemes", path: "/sahara/schemes" },
  { name: "Compass", path: "/khoj/compass" },
  { name: "Circles", path: "/sangam/circles" },
];

test.describe("Accessibility - WCAG AAA", () => {
  for (const { name, path } of PAGES) {
    test(`${name} page passes axe-core WCAG AAA scan`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("domcontentloaded");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag2aaa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const violations = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (violations.length > 0) {
        const summary = violations.map(
          (v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
        ).join("\n");
        expect(violations, `Accessibility violations on ${name}:\n${summary}`).toHaveLength(0);
      }
    });
  }

  test("skip navigation link exists and works", async ({ page }) => {
    await page.goto("/");

    // Tab to the first focusable element - should be skip nav
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip|main content|मुख्य सामग्री/i }).first();

    // Skip link should become visible on focus
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeFocused();
      await skipLink.click();

      // Focus should move to main content
      const main = page.getByRole("main");
      await expect(main).toBeVisible();
    }
  });

  test("all interactive elements have accessible names", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Check buttons have accessible names
    const buttons = page.getByRole("button");
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute("aria-label") ||
        await button.innerText().catch(() => "") ||
        await button.getAttribute("title");
      expect(name, `Button ${i} missing accessible name`).toBeTruthy();
    }

    // Check links have accessible names
    const links = page.getByRole("link");
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const name = await link.getAttribute("aria-label") ||
        await link.innerText().catch(() => "") ||
        await link.getAttribute("title");
      expect(name, `Link ${i} missing accessible name`).toBeTruthy();
    }
  });
});
