import { CustomNotification } from '../lib/useNotification';
import { useToastNotification } from '@allcll/common';

const ToastNotification: CustomNotification = {
  canNotify() {
    return true;
  },
  isGranted() {
    return true;
  },
  requestPermission() {},
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
