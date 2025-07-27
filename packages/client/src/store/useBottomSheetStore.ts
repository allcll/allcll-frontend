import { create } from 'zustand';

export type BottomSheetType = 'filter' | 'search' | 'edit' | 'Info' | null;

interface IBottomSheetStore {
  type: BottomSheetType;
  props?: unknown;
  openBottomSheet: (type: BottomSheetType, props?: unknown) => void;
  closeBottomSheet: (targetType?: BottomSheetType) => void;
  resetBottomSheet: () => void;
}

export const useBottomSheetStore = create<IBottomSheetStore>((set, get) => ({
  type: null,
  openBottomSheet: (type, props) => {
    set({ type, props });
  },
  closeBottomSheet: targetType => {
    const currentType = get().type;
    if (!targetType || currentType === targetType) {
      set({ type: null, props: undefined });
    }
  },
  resetBottomSheet: () => {
    set({ type: null });
  },
}));
