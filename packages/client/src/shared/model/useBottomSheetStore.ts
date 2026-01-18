import { create } from 'zustand';

/**
 * Todo: 디자인 시스템화
 */
export type ScheduleBottomSheetType = 'search' | 'filter' | 'edit' | 'info';

type BottomSheetState = {
  isOpen: boolean;
};

type BottomSheets = Record<ScheduleBottomSheetType, BottomSheetState>;

interface BottomSheetStore {
  type: BottomSheets;

  openBottomSheet: <T extends ScheduleBottomSheetType>(type: T) => void;

  closeBottomSheet: (type: ScheduleBottomSheetType) => void;
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
