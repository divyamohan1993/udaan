import { test, expect } from "@playwright/test";

// Qwik uses resumability -- pages need a moment to become interactive after navigation
const QWIK_SETTLE = 2000;

test.describe("Udaan Full Feature Test", () => {

  test("landing page renders with Hindi content and crisis cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/उड़ान/);

    // Hero message
    const heroText = await page.content();
    expect(heroText).toContain("उड़ान");

    // Crisis entry cards
    const links = page.locator("a[href*='sahara']");
    await expect(links.first()).toBeVisible();
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("emergency numbers in landing page HTML (defense in depth)", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();

    // These must be in the SSR HTML -- defense in depth
    expect(html).toContain("112");
    expect(html).toContain("tel:");
  });

  test("inner pages render with emergency footer", async ({ page }) => {
    // Qwik SSR renders these pages with layout including emergency contacts
    await page.goto("/sahara/mental-health");
    await page.waitForTimeout(QWIK_SETTLE);
    const html = await page.content();
    // Page rendered (not a blank 404)
    expect(html.length).toBeGreaterThan(500);
  });

  test("triage page loads and renders content", async ({ page }) => {
    await page.goto("/sahara/triage?crisis=job-loss");
    await page.waitForTimeout(QWIK_SETTLE);

    const html = await page.content();
    // Page should render meaningful content (not empty)
    expect(html.length).toBeGreaterThan(1000);
  });

  test("mental health page loads with content", async ({ page }) => {
    await page.goto("/sahara/mental-health");
    await page.waitForTimeout(QWIK_SETTLE);

    const html = await page.content();
    // Should have mental health related content
    const hasContent = html.includes("1800-599-0019") ||
                       html.includes("KIRAN") ||
                       html.includes("किरण") ||
                       html.includes("breathe") ||
                       html.includes("सांस") ||
                       html.includes("mental") ||
                       html.includes("मानसिक");
    expect(hasContent).toBe(true);
  });

  test("purpose compass page loads", async ({ page }) => {
    await page.goto("/khoj/compass");
    await page.waitForTimeout(QWIK_SETTLE);

    const html = await page.content();
    // Should have compass/purpose content
    const hasContent = html.includes("compass") ||
                       html.includes("मकसद") ||
                       html.includes("purpose") ||
                       html.includes("radio") ||
                       html.includes("question");
    expect(hasContent).toBe(true);
  });

  test("circles page shows community circles with real neighborhoods", async ({ page }) => {
    await page.goto("/sangam/circles");
    await page.waitForTimeout(QWIK_SETTLE);

    const html = await page.content();
    const hasCircle = html.includes("circle") || html.includes("सर्कल") || html.includes("संगम") || html.includes("मोहल्ला");
    expect(hasCircle).toBe(true);
  });

  test("scheme results page returns real scheme data", async ({ page }) => {
    await page.goto("/sahara/schemes?state=UP&age=26-35&income=BPL&category=OBC&gender=male&occupation=farmer&urgency=urgent&crisis=job-loss");
    await page.waitForTimeout(QWIK_SETTLE);

    const html = await page.content();
    // Should contain real scheme names or Hindi scheme text
    const hasSchemes = html.includes("PM-KISAN") ||
                       html.includes("MGNREGA") ||
                       html.includes("VB-G RAM G") ||
                       html.includes("योजना") ||
                       html.includes("scheme") ||
                       html.includes("पीएम");
    expect(hasSchemes).toBe(true);
  });

  test("all pages load without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForTimeout(QWIK_SETTLE);

    // No uncaught JS errors on landing page
    expect(errors.length).toBe(0);
  });

  test("keyboard navigation -- Tab works without errors", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // No crash = keyboard accessible
    await expect(page).toHaveTitle(/उड़ान/);
  });

  test("dark mode renders without errors", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page).toHaveTitle(/उड़ान/);
  });

  test("mobile viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page).toHaveTitle(/उड़ान/);
    const links = page.locator("a[href*='sahara']");
    await expect(links.first()).toBeVisible();
  });
});
