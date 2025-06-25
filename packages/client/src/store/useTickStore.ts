import { create } from 'zustand';

interface IUseTickStore {
  refCount: number;
  addRefCount: () => void;
  removeRefCount: () => void;
  timer: NodeJS.Timeout | null;
  tick: number;
}

const useTickStore = create<IUseTickStore>((set, get) => {
  const startTimer = () => {
    const timer = setInterval(() => {
      set(state => ({ tick: state.tick + 1 }));
    }, 1000);
    set({ timer });
  };

  const stopTimer = () => {
    const timer = get().timer;
    if (timer) clearInterval(timer);
    set({ timer: null });
  };

  return {
    refCount: 0,
    tick: 0,
    timer: null,
    addRefCount: () => {
      const { refCount } = get();
      if (refCount === 0) startTimer();
      set({ refCount: refCount + 1 });
    },
    removeRefCount: () => {
      const { refCount } = get();
      if (refCount <= 1) {
        stopTimer();
        set({ refCount: 0 });
      } else {
        set({ refCount: refCount - 1 });
      }
    },
  };
});

export default useTickStore;
