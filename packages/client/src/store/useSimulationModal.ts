import { create } from 'zustand';

type ModalType = 'wish' | 'waiting' | null;

interface ModalState {
  type: ModalType;
  props?: any;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: (targetType?: ModalType) => void;
}

export const useSimulationModal = create<ModalState>((set, get) => ({
  type: null,
  props: undefined,
  openModal: (type, props) => set({ type, props }),
  closeModal: targetType => {
    const currentType = get().type;

    if (!targetType || currentType === targetType) {
      set({ type: null, props: undefined });
    }
  },
}));
