// Udaan Service Worker
// Defense in depth: cache-first pages, network-first API, hardcoded emergency fallback
// Every layer assumes the layer above is broken.

const CACHE_VERSION = "udaan-v1";
const CACHE_NAME = `${CACHE_VERSION}-app`;
const API_CACHE = `${CACHE_VERSION}-api`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

// Layer 1 routes -- always available offline, precached on first visit
const PRECACHE_URLS = [
  "/",
  "/sahara/triage",
  "/sahara/schemes",
  "/khoj/compass",
  "/sangam/circles",
];

const PAGE_PATTERNS = [
  /^\/$/,
  /^\/sahara\/.*/,
  /^\/khoj\/.*/,
  /^\/sangam\/.*/,
];

// Hardcoded emergency contacts -- last line of defense
// Even if cache fails, network fails, RxDB fails, these are always available
const EMERGENCY_CONTACTS = [
  { name: "Emergency", nameHi: "आपातकालीन", number: "112", type: "police", available: "24/7" },
  { name: "Ambulance", nameHi: "एम्बुलेंस", number: "108", type: "ambulance", available: "24/7" },
  { name: "KIRAN Mental Health", nameHi: "किरण मानसिक स्वास्थ्य", number: "1800-599-0019", type: "mental-health", available: "24/7, toll-free" },
  { name: "Women Helpline", nameHi: "महिला हेल्पलाइन", number: "181", type: "women", available: "24/7" },
  { name: "Childline", nameHi: "चाइल्डलाइन", number: "1098", type: "child", available: "24/7" },
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="hi" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Udaan - आप अकेले नहीं हैं</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif;
      background: #fef7f0; color: #1a1a1a; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem;
    }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; color: #d97706; }
    .subtitle { font-size: 1.1rem; color: #666; margin-bottom: 2rem; }
    .care { background: #fff; border-radius: 1rem; padding: 1.5rem; max-width: 24rem; width: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1rem; }
    .care p { font-size: 1rem; line-height: 1.6; margin-bottom: 0.75rem; }
    .contacts { list-style: none; }
    .contacts li { padding: 0.75rem 0; border-bottom: 1px solid #eee; }
    .contacts li:last-child { border-bottom: none; }
    .contacts a {
      display: flex; justify-content: space-between; align-items: center;
      text-decoration: none; color: inherit; min-height: 48px;
    }
    .contacts .name { font-weight: 600; }
    .contacts .number {
      background: #059669; color: white; padding: 0.5rem 1rem;
      border-radius: 2rem; font-weight: 700; font-size: 1rem;
      min-width: 48px; min-height: 48px; display: flex; align-items: center;
    }
    .message { text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.9rem; }
  </style>
</head>
<body>
  <main role="main" aria-label="Emergency contacts">
    <h1>आप अकेले नहीं हैं</h1>
    <p class="subtitle">You are not alone. Help is here.</p>
    <div class="care">
      <p>इंटरनेट कनेक्शन नहीं है, लेकिन ये नंबर हमेशा काम करते हैं:</p>
      <p>No internet, but these numbers always work:</p>
      <ul class="contacts" role="list">
        ${EMERGENCY_CONTACTS.map(c => `
        <li>
          <a href="tel:${c.number}" role="link" aria-label="Call ${c.name} at ${c.number}">
            <span>
              <span class="name">${c.nameHi}</span><br>
              <small>${c.name} (${c.available})</small>
            </span>
            <span class="number">${c.number}</span>
          </a>
        </li>`).join("")}
      </ul>
    </div>
    <p class="message">जब इंटरनेट वापस आएगा, Udaan अपने आप लोड हो जाएगा।<br>
    When internet returns, Udaan will load automatically.</p>
  </main>
</body>
</html>`;

// Install: precache all Layer 1 routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Also cache the offline fallback page
        cache.put(
          new Request("/_offline"),
          new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          })
        );
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches, take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== API_CACHE && key !== ASSET_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: defense in depth routing
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Emergency API: always respond, even offline -- hardcoded fallback
  if (url.pathname === "/api/emergency/critical") {
    event.respondWith(
      networkFirst(event.request, API_CACHE).then((response) => {
        if (response.ok) return response;
        // Hardcoded fallback -- emergency contacts never fail
        return new Response(
          JSON.stringify({
            data: EMERGENCY_CONTACTS,
            message: { hi: "ये नंबर हमेशा उपलब्ध हैं।", en: "These numbers are always available." },
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Other API routes: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  // Page routes: cache-first with offline fallback
  const isPage = PAGE_PATTERNS.some((p) => p.test(url.pathname));
  if (isPage || event.request.mode === "navigate") {
    event.respondWith(cacheFirstWithOfflineFallback(event.request));
    return;
  }

  // Assets: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(event.request, ASSET_CACHE));
});

async function cacheFirstWithOfflineFallback(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Cache miss + network fail = show emergency offline page
    // Not a dead end: shows emergency contacts that always work (phone calls)
    const offlinePage = await caches.match("/_offline");
    return offlinePage || new Response(OFFLINE_HTML, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // API offline fallback: caring error + emergency contacts
    return new Response(
      JSON.stringify({
        error: {
          code: "OFFLINE",
          message: {
            hi: "इंटरनेट नहीं है, लेकिन चिंता न करें।",
            en: "No internet, but don't worry.",
          },
          details: null,
        },
        emergency: EMERGENCY_CONTACTS.slice(0, 3),
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
