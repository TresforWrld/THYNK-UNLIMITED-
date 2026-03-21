var CACHE_NAME = 'anicade-tech-v1';
var urlsToCache = [
  '/ANICADEtech.net-in/',
  '/ANICADEtech.net-in/index.html',
  '/ANICADEtech.net-in/manifest.webmanifest',
  '/ANICADEtech.net-in/icon-192.png',
  '/ANICADEtech.net-in/icon-512.png'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('jsonbin.io') > -1) return;
  if (e.request.url.indexOf('fonts.googleapis') > -1) return;
  if (e.request.url.indexOf('imgur.com') > -1) return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      if (r && r.status === 200 && r.type !== 'opaque') {
        var clone = r.clone();
        caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
      }
      return r;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
