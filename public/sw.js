/* KOREA-MOBIS Service Worker
 * Strategy:
 *  - Precache app shell + offline page on install
 *  - Network-first for HTML navigations (fall back to cache, then /offline.html)
 *  - Cache-first for static assets (images, fonts, css, js)
 */

const VERSION = "v1.0.0";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

// Install: precache the shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch: routing
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Skip cross-origin
  if (url.origin !== self.location.origin) return;

  // HTML navigation -> network-first
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          return cached || caches.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  // Static assets -> cache-first
  if (
    ["style", "script", "image", "font"].includes(req.destination)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
            return res;
          })
        );
      })
    );
  }
});
