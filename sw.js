self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Ubeer', {
    body: d.body || 'Tens um novo pedido.',
    tag: d.tag || 'ubeer',
    renotify: true,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var target = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf(self.registration.scope) === 0 && 'focus' in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(target);
  }));
});
