import { CustomNotification } from '@/hooks/useNotification.ts';
import { isSubAlarmActivated, SubAlarmType } from '@/store/useAlarmSettings.ts';

// Vendor prefixes for cross-browser compatibility
const getVibrate = (): ((pattern: VibratePattern) => boolean) | undefined => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
};

const vibrate = getVibrate();

const VibrationNotification: CustomNotification = {
  canNotify(): boolean {
    return !!vibrate;
  },

  isGranted(): boolean {
    return this.canNotify();
  },

  requestPermission(callback?: (permission: NotificationPermission) => void): void {
    if (this.isGranted()) {
      callback?.('granted');
    } else {
      callback?.('denied');
    }
  },

  show(_: string, __?: string): void {
    const activated = isSubAlarmActivated(SubAlarmType.VIBRATE);

    if (vibrate && activated) {
      // Use .call to ensure 'this' is navigator
      vibrate.call(navigator, [200]);
    }
  },

  close(_: string): void {
    if (vibrate) {
      vibrate.call(navigator, 0);
    }
  },
};

export default VibrationNotification;
