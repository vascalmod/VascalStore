self.addEventListener('install', event => {
  console.log('Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log('Service Worker activated')
  return self.clients.claim()
})

self.addEventListener('fetch', event => {
  // Add any fetch event logic here if needed
  // For now, just pass through all requests
  event.respondWith(fetch(event.request))
})
