// Service Worker mínimo — necesario para que Chrome/Android permita instalar la app.
// Cachea el shell básico para que la app abra más rápido y funcione la pantalla
// de login sin conexión (los datos de movimientos siempre requieren internet
// porque viven en Supabase).

const CACHE_NAME = 'registro-cache-v1';
const ARCHIVOS_CORE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
      Promise.all(
        nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
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
