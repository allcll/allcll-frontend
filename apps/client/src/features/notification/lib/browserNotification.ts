import AlarmBanner from '../ui/AlarmBanner.tsx';
import { AlarmType, isAlarmActivated } from '../model/useAlarmSettings.ts';
import useNotificationInstruction from '../model/useNotificationInstruction.ts';
import useBannerNotification, { ISetBanner } from '../model/useBannerNotification.ts';
import { CustomNotification } from '../lib/useNotification.ts';

const getNotification = (): typeof Notification | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.Notification;
};

const getServiceWorker = (): ServiceWorkerContainer | undefined => {
  if (typeof navigator === 'undefined') return undefined;
  return navigator.serviceWorker;
};

const BrowserNotification: CustomNotification = {
  canNotify() {
    return !!getNotification();
  },
  isGranted() {
    return getNotification()?.permission === 'granted';
  },
  requestPermission(callback?: (permission: NotificationPermission) => void) {
    const Notify = getNotification();
    if (!Notify) {
      alert('해당 브라우저는 브라우저 알림을 받을 수 없습니다. 다른 브라우저를 이용해주세요');
      return;
    }

    if (!BrowserNotification.isGranted()) {
      Notify.requestPermission().then(permission => {
        if (callback) callback(permission);
        useNotificationInstruction.getState().setPermitted(permission === 'granted');
      });

      return;
    }

    if (callback) callback(Notify.permission);
  },
  getDeniedMessage() {
    if (!BrowserNotification.canNotify()) {
      return ['해당 브라우저는 브라우저 알림을 지원하지 않습니다'];
    }
    if (!BrowserNotification.isGranted()) {
      return ['브라우저 알림이 차단되어 있습니다. 브라우저의 알림 권한을 허용해주세요'];
    }
    return [];
  },
  show(message: string, tag?: string) {
    const activated = isAlarmActivated(AlarmType.BROWSER);
    const setBanner = useBannerNotification.getState().setBanner;
    const Notify = getNotification();
    const serviceWorker = getServiceWorker();

    if (!Notify || !serviceWorker || !activated || Notify.permission !== 'granted') return;

    checkSystemNotification(setBanner);

    serviceWorker.ready
      .then(function (registration) {
        return registration.showNotification(message, {
          // icon: '/logo-name.svg',
          badge: '/ci.svg',
          tag,
        });
      })
      .catch(function (error) {
        console.warn('Failed to show browser notification:', error);
      });
  },
  close(tag: string) {
    const serviceWorker = getServiceWorker();
    if (!serviceWorker || !BrowserNotification.isGranted()) return;

    serviceWorker.ready
      .then(function (registration) {
        return registration.getNotifications({ tag });
      })
      .then(function (notifications) {
        notifications.forEach(function (notification) {
          notification.close();
        });
      })
      .catch(function (error) {
        console.warn('Failed to close browser notification:', error);
      });
  },
};

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

export default BrowserNotification;
