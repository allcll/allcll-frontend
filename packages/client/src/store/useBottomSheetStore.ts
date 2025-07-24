import { create } from 'zustand';

type BottomSheetType = 'filter' | 'search' | 'edit' | 'Info' | null;

interface IBottomSheetStore {
  type: BottomSheetType;
  props?: unknown;
  openBottomSheet: (type: BottomSheetType, props?: unknown) => void;
  closeBottomSheet: (targetType?: BottomSheetType) => void;
}

export const useBottomSheetStore = create<IBottomSheetStore>((set, get) => ({
  type: 'search',
  openBottomSheet: (type, props) => {
    set({ type, props });
  },
  closeBottomSheet: targetType => {
    const currentType = get().type;
    if (!targetType || currentType === targetType) {
      set({ type: null, props: undefined });
    }
  },
}));
