import { create } from 'zustand';

export interface IToastMessage {
  id: number;
  message: string;
  tag?: string;
}

interface IUseToastNotification {
  isActivated: boolean;
  messages: IToastMessage[];
  addToast: (message: string, tag?: string) => void;
  clearToast: (filter: number | string) => void;
}

let toastId = 0;
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

const useToastNotification = create<IUseToastNotification>((set, get) => ({
  isActivated: false,
  messages: [],
  addToast: (message, tag) => {
    const toast = { id: toastId++, message, tag };

    set(state => ({ messages: [...state.messages, toast] }));
    if (tag) {
      const timerKey = `${tag}-${toast.id}`;
      const timer = setTimeout(() => {
        get().clearToast(toast.id);
        toastTimers.delete(timerKey);
      }, 3000);

      toastTimers.set(timerKey, timer);
    }
  },
  clearToast: filter =>
    set(state => {
      if (typeof filter === 'number') {
        state.messages = state.messages.filter(m => m.id !== filter);
      } else {
        state.messages = state.messages.filter(m => m.tag !== filter);
      }

      return { messages: state.messages };
    }),
}));

export default useToastNotification;
