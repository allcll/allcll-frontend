import AlarmBanner from '@/components/banner/AlarmBanner.tsx';
import { AlarmType, isAlarmActivated } from '@/store/useAlarmSettings.ts';
import useNotificationInstruction from '@/store/useNotificationInstruction.ts';
import useBannerNotification, { ISetBanner } from '@/store/useBannerNotification.tsx';
import { CustomNotification } from '@/hooks/useNotification.ts';

const BrowserNotification: CustomNotification = {
  canNotify() {
    return 'Notification' in window;
  },
  isGranted() {
    return Notification.permission === 'granted';
  },
  requestPermission(callback?: (permission: NotificationPermission) => void) {
    if (!BrowserNotification.canNotify()) {
      alert('해당 브라우저는 브라우저 알림을 받을 수 없습니다. 다른 브라우저를 이용해주세요');
      return;
    }

    if (!BrowserNotification.isGranted()) {
      Notification.requestPermission().then(permission => {
        if (callback) callback(permission);
        useNotificationInstruction.getState().setPermitted(permission === 'granted');
      });

      return;
    }

    if (callback) callback(Notification.permission);
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

    if (activated && Notification.permission === 'granted') {
      checkSystemNotification(setBanner);

      navigator.serviceWorker.ready.then(function (registration) {
        registration
          .showNotification(message, {
            // icon: '/logo-name.svg',
            badge: '/ci.svg',
            tag,
          })
          .then();
      });
    }
  },
  close(tag: string) {
    if (!BrowserNotification.canNotify() || !BrowserNotification.isGranted()) return;

    navigator.serviceWorker.ready.then(function (registration) {
      registration.getNotifications({ tag }).then(function (notifications) {
        notifications.forEach(function (notification) {
          notification.close();
        });
      });
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
