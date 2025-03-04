import {create} from "zustand";

interface IUseTickStore {
  refCount: number;
  addRefCount: () => void;
  removeRefCount: () => void;
  timer: NodeJS.Timeout | null;
  tick: number;
}

const useTickStore = create<IUseTickStore>((set) => ({
  refCount: 0,
  addRefCount: () => set((state) => {
    if (state.refCount === 0) {
      const timer = setInterval(() => {
        set((state) => ({ tick: state.tick + 1 }));
      }, 1000);
      return { refCount: state.refCount + 1, timer };
    }
    return { refCount: state.refCount + 1 };
  }),
  removeRefCount: () => set((state) => {
    if (state.refCount === 1) {
      clearInterval(state.timer!);
      return { refCount: state.refCount - 1, timer: null };
    }
    return { refCount: state.refCount - 1 };
  }),
  timer: null,
  tick: 0
}));

export default useTickStore;