// Service Worker for Talis - Dice Roller PWA
// Cache version should match app version for proper cache invalidation
const CACHE_NAME = 'talis-v1.13.3'
const OFFLINE_FALLBACK_URL = '/_offline'
const NAVIGATION_TIMEOUT_MS = 3500
const API_TIMEOUT_MS = 5000

// Critical resources to cache on install
const urlsToCache = [
  '/',
  '/en',
  '/en/',
  '/de',
  '/de/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  OFFLINE_FALLBACK_URL,
]

const isHtmlRequest = (request) =>
  request.mode === 'navigate' ||
  request.headers.get('accept')?.includes('text/html')

const shouldCacheResponse = (response) =>
  Boolean(response && response.status === 200 && response.type === 'basic')

const isApiRequest = (url) => url.pathname.startsWith('/api/')

const cacheResponse = async (request, response) => {
  if (!shouldCacheResponse(response)) {
    return
  }

  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

const fetchWithTimeout = (request, timeoutMs) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  return fetch(request, { signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId)
  })
}

const precacheResources = async () => {
  const cache = await caches.open(CACHE_NAME)
  const results = await Promise.allSettled(
    urlsToCache.map((urlToCache) => cache.add(urlToCache))
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `[SW] Failed to precache ${urlsToCache[index]}:`,
        result.reason
      )
    }
  })
}

const networkFirstWithTimeout = async (
  request,
  { timeoutMs, preloadResponsePromise = null, fallbackToOffline = false }
) => {
  try {
    if (preloadResponsePromise) {
      const preloadResponse = await preloadResponsePromise
      if (preloadResponse) {
        void cacheResponse(request, preloadResponse.clone())
        return preloadResponse
      }
    }

    const networkResponse = await fetchWithTimeout(request, timeoutMs)
    void cacheResponse(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    if (fallbackToOffline && isHtmlRequest(request)) {
      const offlineResponse = await caches.match(OFFLINE_FALLBACK_URL)
      if (offlineResponse) {
        return offlineResponse
      }
    }

    throw error
  }
}

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (shouldCacheResponse(networkResponse)) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => null)

  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await networkPromise
  if (networkResponse) {
    return networkResponse
  }

  return Response.error()
}

// Install event - cache resources on first load
self.addEventListener('install', (event) => {
  event.waitUntil(precacheResources())
  self.skipWaiting() // Activate immediately
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
          return Promise.resolve()
        })
      )

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable()
      }
    })()
  )
  self.clients.claim() // Take control of all pages immediately
})

// Fetch event - use timeout-aware fallback for documents/APIs
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  if (isHtmlRequest(request)) {
    event.respondWith(
      networkFirstWithTimeout(request, {
        timeoutMs: NAVIGATION_TIMEOUT_MS,
        preloadResponsePromise: event.preloadResponse,
        fallbackToOffline: true,
      })
    )
    return
  }

  if (isApiRequest(url)) {
    event.respondWith(
      networkFirstWithTimeout(request, {
        timeoutMs: API_TIMEOUT_MS,
      })
    )
    return
  }

  // Stale-while-revalidate keeps static assets snappy on slow connections.
  event.respondWith(staleWhileRevalidate(request))
})

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      })
    )
  }
})
