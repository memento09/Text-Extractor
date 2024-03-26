self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("text-extractor-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/popup.html",
        "/content.js",
        "/service-worker.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});