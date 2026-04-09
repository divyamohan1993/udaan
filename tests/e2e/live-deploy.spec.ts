import { test, expect } from "@playwright/test";

const LIVE_URL = "https://udaan-5z7.pages.dev";

test.describe("Live Deploy Verification", () => {

  test("landing page renders with Hindi content", async ({ page }) => {
    await page.goto(LIVE_URL + "/");
    await expect(page).toHaveTitle(/उड़ान/);
    await expect(page.getByText("आपकी मदद यहाँ है")).toBeVisible();
  });

  test("/sahara/triage renders (not 404)", async ({ page }) => {
    const res = await page.goto(LIVE_URL + "/sahara/triage?crisis=job-loss");
    expect(res?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toContain("404");
    expect(title).toContain("उड़ान");
  });

  test("/sahara/mental-health renders (not 404)", async ({ page }) => {
    const res = await page.goto(LIVE_URL + "/sahara/mental-health");
    expect(res?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toContain("404");
  });

  test("/sahara/schemes renders (not 404)", async ({ page }) => {
    const res = await page.goto(LIVE_URL + "/sahara/schemes?state=UP&age=26-35&income=BPL&category=OBC&gender=male&occupation=farmer&urgency=urgent&crisis=job-loss");
    expect(res?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toContain("404");
  });

  test("/khoj/compass renders (not 404)", async ({ page }) => {
    const res = await page.goto(LIVE_URL + "/khoj/compass");
    expect(res?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toContain("404");
  });

  test("/sangam/circles renders (not 404)", async ({ page }) => {
    const res = await page.goto(LIVE_URL + "/sangam/circles");
    expect(res?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toContain("404");
  });

  test("emergency numbers in HTML (defense in depth)", async ({ page }) => {
    await page.goto(LIVE_URL + "/");
    const html = await page.content();
    expect(html).toContain("112");
    expect(html).toContain("1800-599-0019");
    expect(html).toContain("181");
    expect(html).toContain("tel:");
  });

});
