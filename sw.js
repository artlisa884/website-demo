const CACHE_NAME = 'sweet-bliss-menu-v1';

// The exact list of files your phone will save for 100% offline use
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './bg.jpg',
    './cr.jpg',
    './cc.jpg',
    './pm.jpg',
    './pc.jpg',
    './dm.jpg',
    './dl.jpg'
];

// Step 1: Install the Service Worker and Cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Saving menu items into offline storage...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Step 2: Activate and clear old caches if you update prices/items later
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old menu cache...');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Step 3: Serve the website from the cache if the user is offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached file if found, otherwise try to fetch from network
            return cachedResponse || fetch(event.request);
        })
    );
});