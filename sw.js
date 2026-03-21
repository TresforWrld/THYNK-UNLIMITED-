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