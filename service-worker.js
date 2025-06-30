self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('musica-offline-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/service-worker.js',
        // Se quiser adicionar arquivos como CSS, ícones, etc., coloca aqui também
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
