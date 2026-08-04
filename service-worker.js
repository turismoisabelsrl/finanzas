const CACHE_NAME = 'registro-v1';
const ARCHIVOS_CORE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=DM+Sans&family=Inter&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CORE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first: siempre intenta traer lo último; si no hay conexión, usa el cache.
  event.respondWith(
    fetch(event.request)
      .then((respuesta) => {
        const clone = respuesta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return respuesta;
      })
      .catch(() => caches.match(event.request))
  );
});
