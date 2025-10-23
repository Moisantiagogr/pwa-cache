const CACHE_NAME = 'app-shell-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const ASSETS_APP_SHELL = [
    '/',
    '/index.html',
    '/calendario.html',
    '/formulario.html',
    '/main.js',
    '/styles.css',
    '/manifest.json',  // Agregar esta línea
    '/images/icons/192.png',  // Agregar los íconos
    '/images/icons/512.png',
    '/images/icons/apple-icon-180x180.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_APP_SHELL))
    );
});

// Fetch event for dynamic caching
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;

                return fetch(event.request).then(fetchResponse => {
                    // Check if we should cache this request
                    if (shouldCache(event.request.url)) {
                        return caches.open(DYNAMIC_CACHE).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    }
                    return fetchResponse;
                });
            })
    );
});

function shouldCache(url) {
    // Cache FullCalendar and Select2 resources
    return url.includes('fullcalendar') || 
           url.includes('select2') ||
           url.includes('jquery');
}