const CACHE = 'anicade-v4';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('jsonbin.io')) return;
  if (e.request.url.includes('imgur.com')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});