import { create } from 'zustand';

export interface IToastMessage {
  message: string;
  tag?: string;
}

interface IUseToastNotification {
  isActivated: boolean;
  messages: IToastMessage[];
  addToast: (message: string, tag?: string) => void;
  clearToast: (filter: number | string) => void;
}

const useToastNotification = create<IUseToastNotification>((set, get) => ({
  isActivated: false,
  messages: [],
  addToast: (message, tag) => {
    set(state => ({ messages: [...state.messages, { message, tag }] }));
    if (tag) {
      setTimeout(() => get().clearToast(tag), 3000);
    }
  },
  clearToast: filter =>
    set(state => {
      if (typeof filter === 'number') {
        state.messages = [...state.messages.slice(0, filter), ...state.messages.slice(filter + 1)];
      } else {
        state.messages = state.messages.filter(m => m.tag !== filter);
      }

      return { messages: state.messages };
    }),
}));

export default useToastNotification;
