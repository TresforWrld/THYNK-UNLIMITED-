// CACHE VERSION — bump this to force all clients to update
const CACHE = 'anicade-v4';
const PRECACHE = [
  './app.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim()) // take control of all pages immediately
  );
});

self.addEventListener('fetch', e => {
  // Never cache these
  if (
    e.request.url.includes('jsonbin.io') ||
    e.request.url.includes('agentportal') ||
    e.request.url.includes('wa.me') ||
    e.request.url.includes('fonts.googleapis')
  ) return;

  e.respondWith(
    // Network first for HTML — always get fresh app.html
    e.request.destination === 'document'
      ? fetch(e.request)
          .then(resp => {
            if (resp && resp.status === 200) {
              const clone = resp.clone();
              caches.open(CACHE).then(c => c.put(e.request, clone));
            }
            return resp;
          })
          .catch(() => caches.match(e.request))
      // Cache first for everything else
      : caches.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(resp => {
            if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
            return resp;
          });
        })
  );
});
