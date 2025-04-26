// Service Worker file (public/service-worker.js)

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing new service worker...");
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating service worker...");
  event.waitUntil(clients.claim()); // Control all clients immediately
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// You can also add caching and fetch strategies if you want
// but for now, it only handles installation and update.
