// public/service-worker.js

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the waiting service worker to become active immediately
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Ensure that the service worker takes control of all open pages
  });
  