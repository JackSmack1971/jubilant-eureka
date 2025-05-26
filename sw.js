// sw.js - Service Worker with basic caching

const CACHE_NAME = 'raw-alpha-cache-v1';
const urlsToCache = [
    new Request('/'), // Explicitly cache the root path as a Request object
    '/index.html',
    '/css/theme.min.css',
    '/css/style.min.css',
    '/js/script.min.js',
    '/assets/RAW ALPHA LOGO.png',
    '/assets/RAW ALPHA WHITE.png',
    '/assets/RAW ALPHA 2.png',
    '/about.html' // Add about.html to cache
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching App Shell:', urlsToCache);
                return cache.addAll(urlsToCache)
                    .then(() => console.log('Service Worker: App Shell cached successfully'))
                    .catch(error => console.error('Service Worker: Failed to cache App Shell:', error));
            })
    );
    self.skipWaiting(); // Activate new service worker as soon as it's installed
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim()); // Take control of all clients
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    console.log('Service Worker: Not caching invalid network response', event.request.url);
                    return networkResponse;
                }
                // IMPORTANT: Clone the response. A response is a stream
                // and can only be consumed once. We must clone it so that
                // we can consume one in the cache and one in the browser.
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('Service Worker: Caching network resource', event.request.url);
                        cache.put(event.request, responseToCache);
                    });
                return networkResponse;
            })
            .catch(() => {
                console.log('Service Worker: Network fetch failed, trying cache for', event.request.url);
                // Network fetch failed, try to get from cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('Service Worker: Serving from cache (network failed)', event.request.url);
                        return cachedResponse;
                    }
                    // If both cache and network fail, return a fallback
                    console.log('Service Worker: Both network and cache failed for', event.request.url);
                    return new Response('Offline content not available', { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});