// Service Worker: App-Shell offline verfuegbar machen.
// Bei jedem Deploy CACHE hochzaehlen, damit Updates greifen.
const CACHE = "calis-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/styles.css",
  "./src/app.js",
  "./src/core/util.js",
  "./src/core/store.js",
  "./src/data/catalog.js",
  "./src/ui/components.js",
  "./src/ui/screens_home.js",
  "./src/ui/screens_session.js",
  "./src/ui/screens_library.js",
  "./src/ui/screens_calendar.js",
  "./src/ui/screens_more.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Network-first fuer eigene Dateien (immer aktuell), Fallback auf Cache (offline).
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
  );
});
