import { create } from 'zustand';

type ModalType = 'wish' | 'waiting' | 'processing' | 'captcha' | null;

interface ModalState {
  type: ModalType;
  props?: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: (targetType?: ModalType) => void;
}

export const useSimulationModal = create<ModalState>((set, get) => ({
  type: null,
  props: undefined,
  openModal: (type, props) => {
    set({ type, props });

    if (type === 'processing') {
      setTimeout(() => {
        const currentType = get().type;
        if (currentType === 'processing') {
          set({ type: null, props: undefined });
        }
      }, 500);
    }
  },
  closeModal: targetType => {
    const currentType = get().type;

    if (!targetType || currentType === targetType) {
      set({ type: null, props: undefined });
    }
  },
}));
