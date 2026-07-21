/* 매일매일 수학 — 서비스워커
   전략: 앱 셸(index.html)은 네트워크 우선 + 오프라인 캐시 폴백 — 새 버전은 접속 즉시 반영, 오프라인에도 학습 가능.
   Supabase API 호출은 가로채지 않음(same-origin GET만 처리). */
const CACHE = 'mm-shell-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match('./index.html')))
  );
});
