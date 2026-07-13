/* eslint-disable no-restricted-globals */
// Kill-switch: el sitio anterior registraba un service worker (CRA) que
// cachea la app entera; sin este archivo, Vercel respondía el index.html al
// chequeo de updates y el SW viejo quedaba vivo sirviendo el sitio anterior
// para siempre. Este reemplazo se instala, borra todos los cachés, se
// desregistra y recarga las pestañas abiertas.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })()
  )
})
