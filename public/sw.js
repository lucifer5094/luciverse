const CACHE_NAME = 'luciverse-v1'
const STATIC_CACHE = 'luciverse-static-v1'
const DYNAMIC_CACHE = 'luciverse-dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/about',
  '/projects',
  '/vault',
  '/contact',
  '/manifest.json',
  '/next.svg',
  '/vercel.svg'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static files
  if (isStaticFile(url.pathname)) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle page requests
  event.respondWith(handlePageRequest(request))
})

// Handle API requests - network first, cache fallback
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed for API, trying cache')
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for API
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No network connection available' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static files - cache first, network fallback
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Failed to fetch static file', request.url)
    
    // Return placeholder for images
    if (request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    throw error
  }
}

// Handle page requests - cache first with network update
async function handlePageRequest(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // Return cached version immediately
    fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, networkResponse))
        }
      })
      .catch(() => {
        // Network failed, but we have cache
      })
    
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed for page, showing offline page')
    
    // Return offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Offline - Luciverse</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .container { max-width: 400px; }
          h1 { font-size: 2.5rem; margin-bottom: 1rem; }
          p { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9; }
          button {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌌 Offline</h1>
          <p>You're currently offline, but don't worry! Some content might still be available in your cache.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Helper function to check if file is static
function isStaticFile(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/)
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any queued requests when back online
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    // Process any queued form submissions or API calls
    console.log('Service Worker: Background sync completed')
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-72x72.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
