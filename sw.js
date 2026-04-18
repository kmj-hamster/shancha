/**
 * Service Worker - 音频缓存优化版本
 * 主要目的：
 * 1. 让浏览器将应用识别为合法 PWA
 * 2. 对音频文件实现 cache-first 策略，解决首播延迟问题
 */

const CACHE_NAME = 'burning-memory-v3';

// 需要预缓存的音频文件
const AUDIO_FILES = [
  './sound/Atmosphere.m4a',
  './sound/Delete.m4a',
  './sound/discover.m4a',
  './sound/Dream.m4a',
  './sound/Error.m4a',
  './sound/Heartache.m4a',
  './sound/Heartache-2.m4a',
  './sound/Memory.m4a',
  './sound/Mozart.m4a',
  './sound/Opening.m4a',
  './sound/Wagner.m4a'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing v3 with audio cache...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching audio files...');
      // 逐个缓存，避免一个失败导致全部失败
      return Promise.allSettled(
        AUDIO_FILES.map(url =>
          cache.add(url).then(() => {
            console.log('[SW] Cached:', url);
          }).catch(err => {
            console.warn('[SW] Failed to cache:', url, err);
          })
        )
      );
    }).then(() => {
      console.log('[SW] Audio pre-cache complete');
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v3...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 检查是否是音频文件请求
  const isAudioRequest = url.pathname.endsWith('.m4a') ||
                         url.pathname.endsWith('.mp3') ||
                         url.pathname.endsWith('.ogg') ||
                         url.pathname.endsWith('.wav');

  if (isAudioRequest) {
    // 音频文件：Cache-First 策略
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Audio from cache:', url.pathname);
          return cachedResponse;
        }

        // 缓存未命中，从网络获取并缓存
        console.log('[SW] Audio from network:', url.pathname);
        return fetch(event.request).then(networkResponse => {
          // 检查响应是否有效
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // 克隆响应并缓存
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
            console.log('[SW] Cached new audio:', url.pathname);
          });

          return networkResponse;
        });
      })
    );
  } else {
    // 其他资源：网络优先，失败时回退到缓存
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
