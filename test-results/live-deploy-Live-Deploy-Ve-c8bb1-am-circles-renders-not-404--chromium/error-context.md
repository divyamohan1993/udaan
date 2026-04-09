# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-deploy.spec.ts >> Live Deploy Verification >> /sangam/circles renders (not 404)
- Location: tests/e2e/live-deploy.spec.ts:42:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "मुख्य सामग्री पर जाएं / Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - navigation "मुख्य नेविगेशन / Main navigation" [ref=e5]:
      - link "उड़ान Udaan - होम पेज" [ref=e6] [cursor=pointer]:
        - /url: /
        - text: उड़ान Udaan
      - generic [ref=e7]:
        - list [ref=e8]:
          - listitem [ref=e9]:
            - link "सहारा" [ref=e10] [cursor=pointer]:
              - /url: /sahara/triage
          - listitem [ref=e11]:
            - link "खोज" [ref=e12] [cursor=pointer]:
              - /url: /khoj/compass
          - listitem [ref=e13]:
            - link "संगम" [ref=e14] [cursor=pointer]:
              - /url: /sangam/circles
        - 'switch "भाषा: हिन्दी. अंग्रेज़ी पर बदलें" [checked] [ref=e15] [cursor=pointer]':
          - generic [ref=e16]: हि
          - generic [ref=e17]: /
          - generic [ref=e18]: En
  - main [ref=e19]:
    - generic [ref=e20]:
      - alert [ref=e21]:
        - paragraph [ref=e22]: हम समझते हैं, कोई बात नहीं
        - paragraph [ref=e23]: यह पेज नहीं मिला. लेकिन आपकी मदद अभी भी यहाँ है.
        - paragraph [ref=e24]: We understand, no worries. This page wasn't found, but help is still here.
      - generic [ref=e25]:
        - link "होम पेज पर जाएं / Go to Home" [ref=e26] [cursor=pointer]:
          - /url: /
          - text: वापस जाएं / Go Home
        - generic [ref=e27]:
          - link "योजनाएं खोजें / Find Schemes" [ref=e28] [cursor=pointer]:
            - /url: /sahara/triage
          - link "सांस लें / Breathe" [ref=e29] [cursor=pointer]:
            - /url: /sahara/mental-health
      - generic [ref=e30]:
        - paragraph [ref=e31]: आपातकालीन / Emergency
        - paragraph [ref=e32]:
          - link "112" [ref=e33] [cursor=pointer]:
            - /url: tel:112
          - text: "|"
          - link "KIRAN 1800-599-0019" [ref=e34] [cursor=pointer]:
            - /url: tel:1800-599-0019
  - complementary "Emergency contacts" [ref=e35]:
    - paragraph [ref=e36]: आपातकालीन / Emergency
    - generic [ref=e37]:
      - 'link "Emergency services: dial 112" [ref=e38] [cursor=pointer]':
        - /url: tel:112
        - text: 112 Emergency
      - 'link "KIRAN mental health helpline: dial 1800-599-0019" [ref=e39] [cursor=pointer]':
        - /url: tel:1800-599-0019
        - text: 1800-599-0019 KIRAN
      - 'link "Women helpline: dial 181" [ref=e40] [cursor=pointer]':
        - /url: tel:181
        - text: 181 Women
  - contentinfo [ref=e41]:
    - generic [ref=e42]:
      - paragraph [ref=e43]:
        - strong [ref=e44]: उड़ान
        - text: संकट से संकल्प तक | From Crisis to Purpose
      - paragraph [ref=e45]: सपने देखो, साकार करो, साथ चलो | Dream, Manifest, Journey as One
  - region "Mental health quick access" [ref=e46]:
    - button "Mental health support" [ref=e47]: 🤍
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
  9  |     await expect(page).toHaveTitle(/उड़ान/);
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
> 44 |     expect(res?.status()).toBe(200);
     |                           ^ Error: expect(received).toBe(expected) // Object.is equality
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