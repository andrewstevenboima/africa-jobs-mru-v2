// ══════════════════════════════════════════════════════════════════
// Africa Jobs MRU — Service Worker
// Enables full offline access for users across the MRU region
// where internet connectivity is intermittent or unavailable
// ══════════════════════════════════════════════════════════════════

const CACHE_NAME = 'africa-jobs-mru-v2-v1';
const OFFLINE_URL = '/africa-jobs-mru-v2-v2/offline.html';

// Resources to cache immediately on install
const PRECACHE_URLS = [
  '/africa-jobs-mru-v2-v2/',
  '/africa-jobs-mru-v2-v2/index.html',
  '/africa-jobs-mru-v2-v2/offline.html',
  // External fonts & libraries cached via fetch events
];

// External resources to cache when first fetched
const CACHE_PATTERNS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'fonts.cdnfonts.com',
  'cdnjs.cloudflare.com',
  'chart.js',
];

// ── Install: pre-cache core files ─────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('[SW] Install cache error:', err))
  );
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: serve from cache, fall back to network ─────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept non-GET requests or API calls
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/v1/messages')) return; // Anthropic API

  // Strategy: Cache First for static assets, Network First for HTML
  if (event.request.destination === 'document') {
    // HTML pages: Network first, fall back to cache, then offline page
    event.respondWith(networkFirstHTML(event.request));
  } else {
    // Assets (fonts, scripts, images): Cache first, network fallback
    event.respondWith(cacheFirstAsset(event.request));
  }
});

async function networkFirstHTML(request) {
  try {
    const networkResponse = await fetch(request);
    // Cache the fresh response
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    // Network failed — try cache
    const cached = await caches.match(request);
    if (cached) return cached;
    // Nothing in cache — show offline page
    const offlinePage = await caches.match(OFFLINE_URL);
    return offlinePage || new Response(
      '<h1>Offline</h1><p>Africa Jobs MRU is not available right now. Please reconnect.</p>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

async function cacheFirstAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    // Cache external resources (fonts, libraries)
    const url = new URL(request.url);
    const shouldCache = CACHE_PATTERNS.some(p => url.hostname.includes(p));
    if (shouldCache && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return empty response for non-critical assets
    return new Response('', { status: 408 });
  }
}

// ── Background sync: queue offline actions ────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncOfflineActivities());
  }
});

async function syncOfflineActivities() {
  // When back online, notify all open clients to sync offline data
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_COMPLETE', message: 'Back online — your data has been synced.' });
  });
}

// ── Push notifications (future): alert new matching jobs ──────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Africa Jobs MRU', {
      body: data.body || 'New jobs matching your profile are available.',
      icon: '/africa-jobs-mru-v2-v2/icon-192.png',
      badge: '/africa-jobs-mru-v2-v2/icon-192.png',
      data: { url: data.url || '/africa-jobs-mru-v2-v2/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
