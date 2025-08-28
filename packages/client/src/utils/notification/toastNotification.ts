import { CustomNotification } from '@/hooks/useNotification.ts';
import useToastNotification from '@/store/useToastNotification.ts';

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
