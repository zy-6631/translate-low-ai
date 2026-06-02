/**
 * Service Worker — 离线缓存 + PWA 支持
 * 缓存策略：Network First（优先网络，失败时回退缓存）
 */

const CACHE_NAME = 'translate-app-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
];

// Install: 预缓存核心文件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network First 策略
self.addEventListener('fetch', (event) => {
  // 跳过 API 请求（不缓存 DeepSeek API 调用）
  if (event.request.url.includes('api.deepseek.com')) {
    return;
  }

  // 跳过 chrome-extension 等非 http(s) 请求
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 缓存成功的 GET 请求
        if (event.request.method === 'GET' && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败时从缓存返回
        return caches.match(event.request);
      })
  );
});
