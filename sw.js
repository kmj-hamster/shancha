/**
 * Service Worker - 最小化版本
 * 主要目的：让浏览器将应用识别为合法 PWA
 */

const CACHE_NAME = 'burning-memory-v2';

self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  // 清理旧缓存
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
  // 网络优先策略，不干扰正常请求
  event.respondWith(fetch(event.request));
});
