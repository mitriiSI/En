/* Офлайн-режим: сначала сеть (чтобы обновления доходили сразу), при её отсутствии — кэш. */
var CACHE = 'hub-v23';
var SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'data/sections.json',
  'lib/marked.min.js', 'lib/purify.min.js', 'lib/mammoth.browser.min.js', 'lib/widgets.js', 'lib/scene3d.js', 'lib/history-russia.js', 'lib/istoriya-rossii-petr3d.js', 'lib/istoriya-rossii-xviii3d.js', 'lib/istoriya-rossii-reformy3d.js', 'lib/widgets3d.js', 'lib/filosofiya3d.js', 'lib/filosofiya-nicshe3d.js', 'lib/ekonomika3d.js', 'lib/ekonomika-dengi3d.js', 'lib/ekonomika-spros3d.js', 'lib/politucheniya3d.js', 'lib/politucheniya3d-2.js', 'lib/politucheniya3d-3.js', 'lib/politucheniya3d-4.js', 'lib/pravovedenie3d.js', 'lib/pravovedenie3d-2.js', 'lib/upravlenie3d-1.js', 'lib/upravlenie3d-2.js', 'lib/upravlenie3d-3.js', 'lib/upravlenie3d-4.js', 'lib/upravlenie3d-common.js', 'lib/upravlenie3d-1b.js', 'lib/upravlenie3d-2b.js', 'lib/upravlenie3d-3b.js', 'lib/upravlenie3d-4b.js', 'lib/upravlenie2d.js', 'lib/three.min.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }))
        .then(function () { return fetch('data/sections.json'); })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var urls = [];
          (d.sections || []).forEach(function (s) {
            (s.items || []).forEach(function (i) { var u = i.src || (i.url && i.url.indexOf('http') !== 0 ? i.url : null); if (u) urls.push(u); });
          });
          return Promise.all(urls.map(function (u) { return c.add(u).catch(function () {}); }));
        })
        .catch(function () {});
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return; // видео — напрямую из сети (большие файлы, range-запросы)
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (m) {
        return m || (req.mode === 'navigate' ? caches.match('index.html') : Response.error());
      });
    })
  );
});
