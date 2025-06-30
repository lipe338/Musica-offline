const CACHE_NAME = 'musica-offline-cache-v1';

const FILES_TO_CACHE = [
  '/Musica-offline/',
  '/Musica-offline/index.html',
  '/Musica-offline/manifest.json',
  '/Musica-offline/imagem_512x512.png',
  // Se tiver CSS ou JS separados, coloca aqui:
  // '/Musica-offline/style.css',
  // '/Musica-offline/script.js',
];

// Instalação: adiciona arquivos ao cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação: remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requisições e tenta servir do cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;

        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => {
        // Aqui você pode retornar uma página offline ou algo do tipo
        return caches.match('/Musica-offline/index.html');
      })
  );
});
