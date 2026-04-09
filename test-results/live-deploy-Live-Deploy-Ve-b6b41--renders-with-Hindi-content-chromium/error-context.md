# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-deploy.spec.ts >> Live Deploy Verification >> landing page renders with Hindi content
- Location: tests/e2e/live-deploy.spec.ts:7:3

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /उड़ान/
Received string:  "Compute server error | udaan-5z7.pages.dev | Cloudflare"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    9 × unexpected value "Compute server error | udaan-5z7.pages.dev | Cloudflare"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Error 1019" [level=1] [ref=e5]
    - generic [ref=e6]: "Ray ID: 9e98665f7a6e5f2a •"
    - generic [ref=e7]: 2026-04-09 09:14:09 UTC
    - heading "Compute server error" [level=2] [ref=e8]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - heading "What happened?" [level=2] [ref=e11]
      - paragraph [ref=e12]:
        - text: You've requested a page on a website (udaan-5z7.pages.dev) that is on the
        - link "Cloudflare" [ref=e13] [cursor=pointer]:
          - /url: https://www.cloudflare.com/5xx-error-landing/
        - text: network. An error occurred while constructing a dynamic response to your request.
      - paragraph [ref=e14]:
        - text: Please see
        - link "https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1019/" [ref=e15] [cursor=pointer]:
          - /url: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1019/
        - text: for more details.
    - generic [ref=e16]:
      - heading "What can I do?" [level=2] [ref=e17]
      - paragraph [ref=e18]:
        - strong [ref=e19]: "If you are the owner of this website:"
        - text: you should
        - link "login to Cloudflare" [ref=e20] [cursor=pointer]:
          - /url: https://www.cloudflare.com/login?utm_source=error_100x
        - text: and check your error logs.
  - generic [ref=e22]:
    - text: Was this page helpful?
    - button "Yes" [ref=e23] [cursor=pointer]
    - button "No" [ref=e24] [cursor=pointer]
  - paragraph [ref=e26]:
    - generic [ref=e27]:
      - text: "Cloudflare Ray ID:"
      - strong [ref=e28]: 9e98665f7a6e5f2a
    - text: •
    - generic [ref=e29]:
      - text: "Your IP:"
      - button "Click to reveal" [ref=e30] [cursor=pointer]
      - text: •
    - generic [ref=e31]:
      - text: Performance & security by
      - link "Cloudflare" [ref=e32] [cursor=pointer]:
        - /url: https://www.cloudflare.com/5xx-error-landing
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const LIVE_URL = "https://udaan-5z7.pages.dev";
  4  | 
  5  | test.describe("Live Deploy Verification", () => {
  6  | 
  7  |   test("landing page renders with Hindi content", async ({ page }) => {
  8  |     await page.goto(LIVE_URL + "/");
> 9  |     await expect(page).toHaveTitle(/उड़ान/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  10 |     await expect(page.getByText("आपकी मदद यहाँ है")).toBeVisible();
  11 |   });
  12 | 
  13 |   test("/sahara/triage renders (not 404)", async ({ page }) => {
  14 |     const res = await page.goto(LIVE_URL + "/sahara/triage?crisis=job-loss");
  15 |     expect(res?.status()).toBe(200);
  16 |     const title = await page.title();
  17 |     expect(title).not.toContain("404");
  18 |     expect(title).toContain("उड़ान");
  19 |   });
  20 | 
  21 |   test("/sahara/mental-health renders (not 404)", async ({ page }) => {
  22 |     const res = await page.goto(LIVE_URL + "/sahara/mental-health");
  23 |     expect(res?.status()).toBe(200);
  24 |     const title = await page.title();
  25 |     expect(title).not.toContain("404");
  26 |   });
  27 | 
  28 |   test("/sahara/schemes renders (not 404)", async ({ page }) => {
  29 |     const res = await page.goto(LIVE_URL + "/sahara/schemes?state=UP&age=26-35&income=BPL&category=OBC&gender=male&occupation=farmer&urgency=urgent&crisis=job-loss");
  30 |     expect(res?.status()).toBe(200);
  31 |     const title = await page.title();
  32 |     expect(title).not.toContain("404");
  33 |   });
  34 | 
  35 |   test("/khoj/compass renders (not 404)", async ({ page }) => {
  36 |     const res = await page.goto(LIVE_URL + "/khoj/compass");
  37 |     expect(res?.status()).toBe(200);
  38 |     const title = await page.title();
  39 |     expect(title).not.toContain("404");
  40 |   });
  41 | 
  42 |   test("/sangam/circles renders (not 404)", async ({ page }) => {
  43 |     const res = await page.goto(LIVE_URL + "/sangam/circles");
  44 |     expect(res?.status()).toBe(200);
  45 |     const title = await page.title();
  46 |     expect(title).not.toContain("404");
  47 |   });
  48 | 
  49 |   test("emergency numbers in HTML (defense in depth)", async ({ page }) => {
  50 |     await page.goto(LIVE_URL + "/");
  51 |     const html = await page.content();
  52 |     expect(html).toContain("112");
  53 |     expect(html).toContain("1800-599-0019");
  54 |     expect(html).toContain("181");
  55 |     expect(html).toContain("tel:");
  56 |   });
  57 | 
  58 | });
  59 | 
```