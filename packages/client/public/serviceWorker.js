// public/serviceWorker.js

// 1. 푸시 알림 수신 이벤트 (Push Event)
self.addEventListener('push', function (event) {
  let data = {
    title: '새 알림',
    body: '새로운 소식이 도착했습니다.',
    icon: '/icon.png',
    badge: '/badge.png',
    url: '/',
  };

  if (event.data) {
    try {
      // 서버에서 JSON 형태로 보낸 페이로드를 파싱
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      // 텍스트 형태로 온 경우 예외 처리
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    tag: data.tag || 'default-tag', // 알림 그룹핑/중복 방지용 태그
    data: {
      url: data.url || '/', // 알림 클릭 시 이동할 URL 전달
    },
    // 필요 시 추가 가능한 옵션들
    vibrate: [100, 50, 100],
    renotify: true,
  };

  // 서비스 워커 스레드가 비동기 작업(알림 띄우기)이 완료될 때까지 종료되지 않도록 유지
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 2. 알림 클릭 이벤트 (Notification Click Event)
self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // 알림 닫기

  const targetUrl = event.notification.data?.url || '/';

  // 이미 해당 URL이나 앱 탭이 열려있는지 확인 후 포커스, 없으면 새 창 열기
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

