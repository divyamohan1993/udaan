// Udaan Service Worker
// Cache-first for pages, network-first for API, stale-while-revalidate for assets

const CACHE_VERSION = "udaan-v1";
const CACHE_NAME = `${CACHE_VERSION}-app`;
const API_CACHE = `${CACHE_VERSION}-api`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

// Layer 1 routes - always available offline
const PRECACHE_URLS = [
  "/",
  "/sahara/triage",
  "/sahara/schemes",
  "/khoj/compass",
  "/sangam/circles",
];

// Page routes that use cache-first
const PAGE_PATTERNS = [
  /^\/$/,
  /^\/sahara\/.*/,
  /^\/khoj\/.*/,
  /^\/sangam\/.*/,
];

// Install: precache all Layer 1 routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
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

// Fetch strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // API routes: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  // Page routes: cache-first
  const isPage = PAGE_PATTERNS.some((p) => p.test(url.pathname));
  if (isPage || event.request.mode === "navigate") {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  // Assets: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(event.request, ASSET_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline fallback if available
    const fallback = await caches.match("/");
    return fallback || new Response("Offline", { status: 503 });
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
    return cached || new Response(JSON.stringify({ error: { code: "OFFLINE", message: "No network connection", details: null } }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
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
