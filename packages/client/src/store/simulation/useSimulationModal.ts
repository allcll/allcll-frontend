import { create } from 'zustand';

export type ModalType = 'tutorial' | 'wish' | 'waiting' | 'captcha' | 'simulation' | 'result' | null;

interface IModalStateStore {
  type: ModalType;
  props?: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: (targetType?: ModalType) => void;
}

export const useSimulationModalStore = create<IModalStateStore>((set, get) => ({
  type: null,
  props: undefined,
  openModal: (type, props) => {
    set({ type, props });
  },

  closeModal: targetType => {
    const currentType = get().type;

    if (!targetType || currentType === targetType) {
      set({ type: null, props: undefined });
    }
  },
}));
