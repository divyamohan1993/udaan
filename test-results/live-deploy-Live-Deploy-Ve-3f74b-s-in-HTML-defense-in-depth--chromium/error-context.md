# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-deploy.spec.ts >> Live Deploy Verification >> emergency numbers in HTML (defense in depth)
- Location: tests/e2e/live-deploy.spec.ts:49:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "112"
Received string:    "<!DOCTYPE html><html class=\"no-js\" lang=\"en-US\"><!--<![endif]--><head>
        <title>Compute server error | udaan-5z7.pages.dev | Cloudflare</title>
        <meta charset=\"UTF-8\">
<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">
<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\">
<meta name=\"robots\" content=\"noindex, nofollow\">
<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
<link rel=\"stylesheet\" id=\"cf_styles-css\" href=\"/cdn-cgi/styles/main.css\"> <script>
  (function(){if(document.addEventListener&&window.XMLHttpRequest&&JSON&&JSON.stringify){var e=function(a){var c=document.getElementById(\"error-feedback-survey\"),d=document.getElementById(\"error-feedback-success\"),b=new XMLHttpRequest;a={event:\"feedback clicked\",properties:{errorCode: 1019 },helpful:a,version: 1 };b.open(\"POST\",\"https://sparrow.cloudflare.com/api/v1/event\");b.setRequestHeader(\"Content-Type\",\"application/json\");b.setRequestHeader(\"Sparrow-Source-Key\",\"c771f0e4b54944bebf4261d44bd79a1e\");
b.send(JSON.stringify(a));c.classList.add(\"feedback-hidden\");d.classList.remove(\"feedback-hidden\")};document.addEventListener(\"DOMContentLoaded\",function(){var a=document.getElementById(\"error-feedback\"),c=document.getElementById(\"feedback-button-yes\"),d=document.getElementById(\"feedback-button-no\");\"classList\"in a&&(a.classList.remove(\"feedback-hidden\"),c.addEventListener(\"click\",function(){e(!0)}),d.addEventListener(\"click\",function(){e(!1)}))})}})();
</script>
        <script defer=\"\" src=\"https://performance.radar.cloudflare.com/beacon.js\"></script>
    </head>
    <body>
        <div id=\"cf-wrapper\">
            <div class=\"cf-alert cf-alert-error cf-cookie-error hidden\" id=\"cookie-alert\" data-translate=\"enable_cookies\">
                Please enable cookies.
            </div>
            <div id=\"cf-error-details\" class=\"p-0\">
                <header class=\"mx-auto pt-10 lg:pt-6 lg:px-8 w-240 lg:w-full mb-15 antialiased\">
                    <h1 class=\"inline-block md:block mr-2 md:mb-2 font-light text-60 md:text-3xl text-black-dark leading-tight\">
                        <span data-translate=\"error\">Error</span>
                        <span>1019</span>
                    </h1>
                    <span class=\"inline-block md:block heading-ray-id font-mono text-15 lg:text-sm lg:leading-relaxed\">Ray ID: 9e98694def2d5909 •</span>
                    <span class=\"inline-block md:block heading-ray-id font-mono text-15 lg:text-sm lg:leading-relaxed\">2026-04-09 09:16:09 UTC</span>
                    <h2 class=\"text-gray-600 leading-1.3 text-3xl lg:text-2xl font-light\">
                        Compute server error
                    </h2>
                </header>··································
                <section class=\"w-240 lg:w-full mx-auto mb-8 lg:px-8\">
                    <div id=\"what-happened-section\" class=\"w-1/2 md:w-full\">
                        <h2 class=\"text-3xl leading-tight font-normal mb-4 text-black-dark antialiased\" data-translate=\"what_happened\">
                            What happened?
                        </h2>·························
                            <p>You've requested a page on a website (udaan-5z7.pages.dev) that is on the <a href=\"https://www.cloudflare.com/5xx-error-landing/\" target=\"_blank\">Cloudflare</a> network. An error occurred while constructing a dynamic response to your request.</p>··················································
                        <p>
                            Please see
                            <a rel=\"noopener noreferrer\" href=\"https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1019/\" target=\"_blank\">https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1019/</a>
                            for more details.
                        </p>·························
                    </div>······················
                    <div id=\"resolution-copy-section\" class=\"w-1/2 mt-6 text-15 leading-normal\">
                        <h2 class=\"text-3xl leading-tight font-normal mb-4 text-black-dark antialiased\" data-translate=\"what_can_i_do\">
                            What can I do?
                        </h2>
                        <p><strong>If you are the owner of this website:</strong><br>you should <a href=\"https://www.cloudflare.com/login?utm_source=error_100x\" target=\"_blank\">login to Cloudflare</a> and check your error logs.</p>
                    </div>·····················
                </section>··················
                <div class=\"py-8 text-center\" id=\"error-feedback\">
    <div id=\"error-feedback-survey\" class=\"footer-line-wrapper\">
        Was this page helpful?
        <button class=\"border border-solid bg-white cf-button cursor-pointer ml-4 px-4 py-2 rounded\" id=\"feedback-button-yes\" type=\"button\">
            Yes
        </button>
        <button class=\"border border-solid bg-white cf-button cursor-pointer ml-4 px-4 py-2 rounded\" id=\"feedback-button-no\" type=\"button\">
            No
        </button>
    </div>
    <div class=\"feedback-success feedback-hidden\" id=\"error-feedback-success\">
        Thank you for your feedback!
    </div>
</div> <div class=\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\">
    <p class=\"text-13\">
      <span class=\"cf-footer-item sm:block sm:mb-1\">Cloudflare Ray ID: <strong class=\"font-semibold\">9e98694def2d5909</strong></span>
      <span class=\"cf-footer-separator sm:hidden\">•</span>
      <span id=\"cf-footer-item-ip\" class=\"cf-footer-item sm:block sm:mb-1\">
        Your IP:
        <button type=\"button\" id=\"cf-footer-ip-reveal\" class=\"cf-footer-ip-reveal-btn\">Click to reveal</button>
        <span class=\"hidden\" id=\"cf-footer-ip\">2a06:98c0:3600::103</span>
        <span class=\"cf-footer-separator sm:hidden\">•</span>
      </span>
      <span class=\"cf-footer-item sm:block sm:mb-1\"><span>Performance &amp; security by</span> <a rel=\"noopener noreferrer\" href=\"https://www.cloudflare.com/5xx-error-landing\" id=\"brand_link\" target=\"_blank\">Cloudflare</a></span>·······
    </p>
    <script>(function(){function d(){var b=a.getElementById(\"cf-footer-item-ip\"),c=a.getElementById(\"cf-footer-ip-reveal\");b&&\"classList\"in b&&(b.classList.remove(\"hidden\"),c.addEventListener(\"click\",function(){c.classList.add(\"hidden\");a.getElementById(\"cf-footer-ip\").classList.remove(\"hidden\")}))}var a=document;document.addEventListener&&a.addEventListener(\"DOMContentLoaded\",d)})();</script>
  </div><!-- /.error-footer -->
            </div>
            <!-- /#cf-error-details -->
        </div>
        <!-- /#cf-wrapper -->·
         <script>
    window._cf_translation = {};··········
  </script>···············
<span style=\"display: none !important;\"><img width=\"0\" height=\"0\" hidden=\"\" referrerpolicy=\"no-referrer\" src=\"https://cedexis-test.akamaized.net/img/r20-100KB.png?r=71052453\" style=\"display: none !important;\"></span></body></html>"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Error 1019" [level=1] [ref=e5]
    - generic [ref=e6]: "Ray ID: 9e98694def2d5909 •"
    - generic [ref=e7]: 2026-04-09 09:16:09 UTC
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
      - strong [ref=e28]: 9e98694def2d5909
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
  44 |     expect(res?.status()).toBe(200);
  45 |     const title = await page.title();
  46 |     expect(title).not.toContain("404");
  47 |   });
  48 | 
  49 |   test("emergency numbers in HTML (defense in depth)", async ({ page }) => {
  50 |     await page.goto(LIVE_URL + "/");
  51 |     const html = await page.content();
> 52 |     expect(html).toContain("112");
     |                  ^ Error: expect(received).toContain(expected) // indexOf
  53 |     expect(html).toContain("1800-599-0019");
  54 |     expect(html).toContain("181");
  55 |     expect(html).toContain("tel:");
  56 |   });
  57 | 
  58 | });
  59 | 
```