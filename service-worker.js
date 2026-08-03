const CACHE_NAME = 'registro-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=DM+Sans&family=Inter&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});