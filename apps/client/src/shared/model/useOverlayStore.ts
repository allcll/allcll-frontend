import { create } from 'zustand';

export type OverlayType = 'search' | 'filter' | 'edit' | 'info' | 'feedback';

type OverlayState = {
  isOpen: boolean;
};

type Overlays = Record<OverlayType, OverlayState>;

interface OverlayStore {
  type: Overlays;

  openOverlay: <T extends OverlayType>(type: T) => void;

  closeOverlay: (type: OverlayType) => void;
}

const initialOverlays: Overlays = {
  search: { isOpen: false },
  filter: { isOpen: false },
  edit: { isOpen: false },
  info: { isOpen: false },
  feedback: { isOpen: false },
};

export const useOverlayStore = create<OverlayStore>(set => ({
  type: initialOverlays,

  openOverlay: type =>
    set(state => ({
      type: {
        ...state.type,
        [type]: { isOpen: true },
      },
    })),

  closeOverlay: type =>
    set(state => ({
      type: {
        ...state.type,
        [type]: { isOpen: false },
      },
    })),
}));
