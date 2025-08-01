import { useEffect } from 'react';
import { PinnedSeats, Wishlist } from '@/utils/types.ts';
import { QueryClient } from '@tanstack/react-query';
import useSSECondition from '@/store/useSSECondition.ts';
import useBannerNotification, { ISetBanner } from '@/store/useBannerNotification.tsx';
import AlarmBanner from '@/components/banner/AlarmBanner.tsx';
import useToastNotification from '@/store/useToastNotification.ts';
import useAlarmSettings from '@/store/useAlarmSettings.ts';

// notification 변수
let isInitialized = false;

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
  const isAlarmActivated = useAlarmSettings.getState().isAlarmActivated;

  if (isAlarmActivated)
    navigator.serviceWorker.ready.then(function (registration) {
      registration
        .showNotification(message, {
          // icon: '/logo-name.svg',
          badge: '/ci.svg',
          tag,
        })
        .then();
    });

  const addToast = useToastNotification.getState().addToast;
  const isToastActivated = useAlarmSettings.getState().isToastActivated;
  if (isToastActivated) addToast(message, tag);
}

function closeNotification(tag: string) {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.getNotifications({ tag }).then(function (notifications) {
      notifications.forEach(function (notification) {
        notification.close();
      });
    });
  });

  const clearToast = useToastNotification.getState().clearToast;
  clearToast(tag);
}

export function onChangePinned(prev: Array<PinnedSeats>, newPin: Array<PinnedSeats>, queryClient: QueryClient) {
  const { alwaysReload } = useSSECondition.getState();

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

let globalNotificationTimeout: NodeJS.Timeout | null = null;
let globalNotificationTagId = 1;

// 알림 메세지 관련 Notification 은 한 개만 띄웁니다
function setGlobalNotification(message: string) {
  const nowTag = 'global-notification_' + globalNotificationTagId;
  const nextTag = 'global-notification_' + ++globalNotificationTagId;

  if (globalNotificationTimeout) {
    clearTimeout(globalNotificationTimeout);
    closeNotification(nowTag);
    globalNotificationTimeout = null;
  }

  showNotification(message, nextTag);
  globalNotificationTimeout = setTimeout(() => closeNotification(nextTag) /*globalNotification?.close()*/, 3000);
}

const DAYS = 1000 * 60 * 60 * 24;
// 맥에서 알림이 보이지 않을 때, 알림 권한을 확인합니다
function checkSystemNotification(setBanner: ISetBanner) {
  const ALARM_CHECK_TITLE = 'alarm-check';
  const alarmDate = localStorage.getItem(ALARM_CHECK_TITLE);

  if (alarmDate && Date.now() - Number(alarmDate) < 100 * DAYS) {
    return;
  }

  setTimeout(() => {
    setBanner(AlarmBanner(), () => {
      localStorage.setItem(ALARM_CHECK_TITLE, Date.now().toString());
    });
  }, 5000);
}

function useNotification() {
  const alwaysReload = useSSECondition(state => state.alwaysReload);
  const setAlwaysReload = useSSECondition(state => state.setAlwaysReload);
  const setBanner = useBannerNotification(state => state.setBanner);

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
      checkSystemNotification(setBanner);
      setAlwaysReload(true);
    });

    isInitialized = true;
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
        checkSystemNotification(setBanner);
        setAlwaysReload(true);
      } else if (permission === 'default') {
        alert('알림 권한을 허용해야 알림을 받을 수 있습니다');
      } else {
        alert('알림 권한이 없습니다. 브라우저의 알림 권한을 확인해주세요.');
      }
    });
  };

  return { isAlarm, changeAlarm };
}

export default useNotification;
