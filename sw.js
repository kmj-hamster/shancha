/**
 * Service Worker - 最小化版本
 * 主要目的：让浏览器将应用识别为合法 PWA
 */

const CACHE_NAME = 'burning-memory-v1';

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // 网络优先策略，不干扰正常请求
  event.respondWith(fetch(event.request));
});
