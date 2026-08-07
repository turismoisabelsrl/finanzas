const CACHE_NAME = 'turismo-isabel-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@400;500;600;700;800&display=swap'
];

// Instalación: Guarda los archivos esenciales en el teléfono
// CORRECCIÓN ACTUALIZACIÓN: skipWaiting() hace que la versión nueva no se quede
// esperando a que cierres todas las pestañas/la app para activarse.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activación: Limpia versiones viejas
// CORRECCIÓN ACTUALIZACIÓN: clients.claim() hace que la versión nueva tome el
// control de la página ya abierta, sin necesitar recargar manualmente.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

// Permite forzar la activación de la nueva versión desde la página
// (por ejemplo, con un botón "Actualizar" que le mande este mensaje al SW).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estrategia: Network First (busca la versión más nueva en internet primero;
// si no hay conexión, usa lo que quedó guardado en el teléfono).
// CORRECCIÓN ACTUALIZACIÓN: antes era "Cache First" y por eso nunca traía cambios nuevos.
self.addEventListener('fetch', (event) => {
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
