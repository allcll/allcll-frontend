import { CustomNotification } from '../lib/useNotification';
import useToastNotification from '../model/useToastNotification.ts';

const ToastNotification: CustomNotification = {
  canNotify() {
    return true;
  },
  isGranted() {
    return true;
  },
  requestPermission(_?: (permission: NotificationPermission) => void) {},
  getDeniedMessage() {
    return [];
  },
  show(message: string, tag?: string) {
    const addToast = useToastNotification.getState().addToast;
    if (addToast) addToast(message, tag);
  },
  close(tag: string) {
    const clearToast = useToastNotification.getState().clearToast;
    clearToast(tag);
  },
};

export default ToastNotification;
