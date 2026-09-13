// service worker to ensure offline access / functionality
//
// events
// "install"    : fires once, when the browser sees this service worker (or a changed version of it (CACHE_NAME specifically)) 
//                essentially tells the browser to download and store the specified files in persistent cache
// "activate"   : fires when isntall is done, 
//                checks cached files and deletes any that are no longer specified (cleanup of stale files) 
// "fetch"      : fires on every network request made by the page
//                checks if the response is already cached -> uses that 
//                if not, actually run a fetch request
//
// IMPORTANT: changes in CACHE_NAME trigger local updates (doesn't manually check if file content changed)
//            -> if changing anything on server, don't forget to update the version to force cache updates


// force network requests, bypassing the smart caching strategy for faster iteration during development
// see "fetch" event below
const DEV_MODE = true; 

importScripts("./version.js") // retrieve version from central source (needs to use importScripts due to service worker restrictions)
const CACHE_NAME = `seal-counter-v${APP_VERSION}`; // build name using imported version number. example: 'seal-counter-v0.2.3'

const CACHED_URLS = [
  "./",
  "./index.html",
  "./app.html",
  "./style.css",
  "./manifest.json",
  "./js/strings.js",
  "./js/welcome.js",
  "./js/app.js",
  "./assets/visual-guide-placeholder.svg",
  "./assets/favicon.ico"
];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_URLS))
//   );
//   self.skipWaiting();
// });

// now forces a reload on event firing -> forces actual check for changes, instead of relying on http cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        CACHED_URLS.map((url) =>
          fetch(url, { cache: "reload" }).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            return cache.put(url, response);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (DEV_MODE) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});