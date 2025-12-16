import { create } from 'zustand';

export type BottomSheetType = 'search' | 'filter' | 'edit' | 'info';

type BottomSheetState = {
  isOpen: boolean;
};

type BottomSheets = Record<BottomSheetType, BottomSheetState>;

interface BottomSheetStore {
  type: BottomSheets;

  openBottomSheet: <T extends BottomSheetType>(type: T) => void;

  closeBottomSheet: (type: BottomSheetType) => void;
  resetBottomSheet: () => void;
}

const initialSheets: BottomSheets = {
  search: { isOpen: false },
  filter: { isOpen: false },
  edit: { isOpen: false },
  info: { isOpen: false },
};

export const useBottomSheetStore = create<BottomSheetStore>(set => ({
  type: initialSheets,

  openBottomSheet: type =>
    set(state => ({
      type: {
        ...state.type,
        [type]: { isOpen: true },
      },
    })),

  closeBottomSheet: type =>
    set(state => ({
      type: {
        ...state.type,
        [type]: { isOpen: false },
      },
    })),

  resetBottomSheet: () =>
    set({
      type: initialSheets,
    }),
}));
