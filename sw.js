const CACHE = 'anicade-tech-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll([
        '/ANICADEtech.net-in/app.html',
        '/ANICADEtech.net-in/manifest.webmanifest'
      ]).catch(() => {})
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('jsonbin.io')) return;
  if (e.request.url.includes('imgur.com')) return;
  if (e.request.url.includes('fonts.googleapis')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
