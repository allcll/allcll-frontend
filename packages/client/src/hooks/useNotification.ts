import {useEffect} from 'react';
import {PinnedSeats, Wishlist} from '@/utils/types.ts';
import {QueryClient} from '@tanstack/react-query';
import useSSECondition from '@/store/useSSECondition.ts';


export function canNotify() {
  return 'Notification' in window;
}

export function isGranted() {
  return Notification.permission === 'granted';
}

export function requestNotificationPermission(callback?: (permission: NotificationPermission) => void) {
  if (!canNotify()) {
    alert('해당 브라우저는 알림을 받을 수 없는 브라우저입니다. 다른 브라우저를 이용해주세요');
    return;
  }

  if (!isGranted()) {
    Notification.requestPermission().then(permission => {
      if (callback) {
        callback(permission);
      }
    });

    return;
  }

  if (callback) {
    callback(Notification.permission);
  }
}

function showNotification(message: string, tag?: string) {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.showNotification(message, {
      // icon: '/logo-name.svg',
      badge: '/ci.svg',
      tag
    }).then();
  });
}

function closeNotification(tag: string) {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.getNotifications({ tag }).then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  });
}

export function onChangePinned(prev: Array<PinnedSeats>, newPin: Array<PinnedSeats>, queryClient: QueryClient) {
  const {alwaysReload} = useSSECondition.getState();

  if (!canNotify() || !prev || !newPin || !alwaysReload) {
    return;
  }

  // Check if there are seats available for pinned subjects
  for (const pin of newPin) {
    const hasSeat = prev.some(p => p.subjectId === pin.subjectId && p.seatCount === 0 && pin.seatCount > 0);
    if (hasSeat) {
      const wishes = getWishes(queryClient, pin.subjectId);

      if (wishes) {
        showNotification(`${wishes.subjectCode}-${wishes.classCode} ${wishes.subjectName} 여석이 생겼습니다`);
        return;
      }

      showNotification(`unknown subject의 여석이 생겼습니다`);
    }
  }
}

function getWishes(queryClient: QueryClient, subjectId: number) {
  const wishes = queryClient.getQueryData<Wishlist>(['wishlist'])?.baskets ?? [];
  return wishes.find(wish => wish.subjectId === subjectId);
}

// let globalNotification: Notification | null = null;
let globalNotificationTimeout: NodeJS.Timeout | null = null;

// 알림 메세지 관련 Notification 은 한 개만 띄웁니다
function setGlobalNotification(message: string) {
  if (globalNotificationTimeout) {
    clearTimeout(globalNotificationTimeout);
    globalNotificationTimeout = null;
  }

  showNotification(message, 'global-notification');
  globalNotificationTimeout = setTimeout(() => closeNotification('global-notification') /*globalNotification?.close()*/, 3000);
}

function useNotification() {
  const isInitialized = useSSECondition(state => state.isInitialized);
  const setInitialized = useSSECondition(state => state.endInitialized);

  const alwaysReload = useSSECondition(state => state.alwaysReload);
  const setAlwaysReload = useSSECondition(state => state.setAlwaysReload);

  const isAlarm = canNotify() && isGranted() && alwaysReload;

  // only run once
  useEffect(() => {
    if (isInitialized) return;

    requestNotificationPermission(permission => {
      if (permission !== 'granted') {
        setAlwaysReload(false);
        return;
      }

      setGlobalNotification('알림 기능이 활성화되었습니다. 여석이 생기면 이렇게 알림을 보내드려요');
      setAlwaysReload(true);
    });

    setInitialized();
  }, []);

  const changeAlarm = () => {
    if (isAlarm) {
      if (isGranted()) {
        setGlobalNotification('알림 기능이 비활성화되었습니다');
      }

      setAlwaysReload(false);
      return;
    }

    // request permission
    requestNotificationPermission(permission => {
      if (permission === 'granted') {
        setGlobalNotification('알림 기능이 활성화되었습니다');
        setAlwaysReload(true);
      }
      else if (permission === 'default') {
        alert('알림 권한을 허용해야 알림을 받을 수 있습니다');
      }
      else {
        alert('알림 권한이 없습니다. 브라우저의 알림 권한을 확인해주세요.');
      }
    });
  }

  return {isAlarm, changeAlarm};
}

export default useNotification;