import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import useSSECondition from '@/store/useSSECondition.ts';
import useAlarmSettings, {
  AlarmType,
  isAlarmActivated,
  isSubAlarmActivated,
  SubAlarmType,
} from '@/store/useAlarmSettings.ts';
import BrowserNotification from '@/utils/notification/browserNotification.ts';
import VibrationNotification from '@/utils/notification/vibrationNotification.ts';
import ToastNotification from '@/utils/notification/toastNotification.ts';
import { PinnedSeats, Wishlist } from '@/utils/types.ts';
import useNotificationInstruction from '@/store/useNotificationInstruction.ts';

export interface CustomNotification {
  canNotify(): boolean;
  isGranted(): boolean;
  requestPermission(callback?: (permission: NotificationPermission) => void): void;
  show(message: string, tag?: string): void;
  close(tag: string): void;
}

// notification 변수
let isInitialized = false;

function getNotifications(): CustomNotification[] {
  const notifications: CustomNotification[] = [];

  const browser = isAlarmActivated(AlarmType.BROWSER);
  const toast = isAlarmActivated(AlarmType.TOAST);
  const vibration = isSubAlarmActivated(SubAlarmType.VIBRATION);
  // const sound = isSubAlarmActivated(SubAlarmType.SOUND);

  if (browser) notifications.push(BrowserNotification);
  if (toast) notifications.push(ToastNotification);
  if (vibration) notifications.push(VibrationNotification);
  // if (sound) notifications.push(SoundNotification);

  return notifications;
}

export const AlarmNotification: CustomNotification = {
  canNotify() {
    return getNotifications().every(n => n.canNotify());
  },

  isGranted() {
    return getNotifications().every(n => {
      const g = n.isGranted();
      console.log(n, g);
      return g;
    });
  },

  requestPermission(callback?: (permission: NotificationPermission) => void) {
    if (AlarmNotification.isGranted()) return;

    getNotifications().forEach(n => n.requestPermission(callback));
    useNotificationInstruction.getState().open();
  },

  show(message: string, tag?: string) {
    getNotifications().forEach(n => n.show(message, tag));
  },

  close(tag: string) {
    getNotifications().forEach(n => n.close(tag));
  },
};

export function onChangePinned(prev: Array<PinnedSeats>, newPin: Array<PinnedSeats>, queryClient: QueryClient) {
  const { alwaysReload } = useSSECondition.getState();

  if (!prev || !newPin || !alwaysReload) {
    return;
  }

  // Check if there are seats available for pinned subjects
  for (const pin of newPin) {
    const hasSeat = prev.some(p => p.subjectId === pin.subjectId && p.seatCount === 0 && pin.seatCount > 0);
    if (hasSeat) {
      const wishes = getWishes(queryClient, pin.subjectId);

      if (!wishes) {
        AlarmNotification.show(`unknown subject의 여석이 생겼습니다`);
        return;
      }
      AlarmNotification.show(`${wishes.subjectCode}-${wishes.classCode} ${wishes.subjectName} 여석이 생겼습니다`);
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
    AlarmNotification.close(nowTag);
    globalNotificationTimeout = null;
  }

  AlarmNotification.show(message, nextTag);
  globalNotificationTimeout = setTimeout(() => AlarmNotification.close(nextTag), 3000);
}

function useNotification() {
  const alwaysReload = useSSECondition(state => state.alwaysReload);
  const setAlwaysReload = useSSECondition(state => state.setAlwaysReload);

  const isAlarm = alwaysReload;

  // only run once
  useEffect(() => {
    if (isInitialized) return;

    if (AlarmNotification.isGranted()) {
      setGlobalNotification('알림 기능이 활성화되었습니다. 여석이 생기면 이렇게 알림을 보내드려요');
      setAlwaysReload(true);
    }

    isInitialized = true;
  }, []);

  const changeAlarm = () => {
    // 알림 기능 활성화 할 때
    if (!isAlarm) {
      const alarmType = useAlarmSettings.getState().alarmType;
      if (alarmType === AlarmType.NONE) {
        if (!confirm('알림 기능을 활성화 하시겠습니까?')) return;
        useAlarmSettings.getState().resetSettings();
      }
      AlarmNotification.requestPermission();
    }

    const message = !isAlarm ? '알림 기능이 활성화되었습니다' : '알림 기능이 비활성화되었습니다';
    setAlwaysReload(!isAlarm);
    setGlobalNotification(message);
  };

  return { isAlarm, changeAlarm };
}

export default useNotification;
