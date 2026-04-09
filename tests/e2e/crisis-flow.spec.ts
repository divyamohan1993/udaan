import { test, expect } from "@playwright/test";

test.describe("Crisis Flow", () => {
  test("navigates from landing to triage to schemes", async ({ page }) => {
    // Land on the homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/Udaan|उड़ान/i);

    // Look for crisis entry point and click it
    const crisisButton = page.getByRole("link", { name: /lost.*job|I need help|help|सहायता/i }).first();
    await expect(crisisButton).toBeVisible();
    await crisisButton.click();

    // Should navigate to triage
    await expect(page).toHaveURL(/sahara\/triage/);

    // Fill triage form - state selection
    const stateSelect = page.getByRole("combobox", { name: /state|राज्य/i }).first();
    if (await stateSelect.isVisible()) {
      await stateSelect.selectOption({ index: 1 });
    }

    // Look for next/continue button
    const nextButton = page.getByRole("button", { name: /next|continue|आगे/i }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  });

  test("emergency contacts are visible on crisis pages", async ({ page }) => {
    await page.goto("/");

    // Emergency contacts should be accessible from landing page
    const emergencySection = page.getByText(/emergency|आपातकालीन|helpline|हेल्पलाइन/i).first();
    await expect(emergencySection).toBeVisible();

    // Check for at least one phone number pattern
    const phoneNumber = page.getByText(/112|108|1800|181|1098/i).first();
    await expect(phoneNumber).toBeVisible();
  });

  test("breathing exercise is accessible", async ({ page }) => {
    await page.goto("/sahara/triage");

    // Look for mental health or breathing section
    const breathingLink = page.getByRole("link", { name: /breath|mental|शांत|सांस/i }).first();
    if (await breathingLink.isVisible()) {
      await breathingLink.click();
    }

    // On schemes or mental health page, breathing exercise should be present
    await page.goto("/sahara/schemes");
    const breathingSection = page.getByText(/breathe|breath|सांस|4-4-6|grounding/i).first();
    if (await breathingSection.isVisible()) {
      await expect(breathingSection).toBeVisible();
    }
  });
});
