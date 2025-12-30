import { create } from 'zustand';

interface IUseTickStore {
  addRefCount: () => void;
  removeRefCount: () => void;
  tick: number;
}

let timer: NodeJS.Timeout | null = null;
let refCount = 0; // timer를 사용하는 컴포넌트 수

const useTickStore = create<IUseTickStore>(set => {
  const startTimer = () => {
    if (timer) return;

    timer = setInterval(() => {
      set(state => ({ tick: state.tick + 1 }));
    }, 1000);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  return {
    tick: 0,
    addRefCount: () => {
      if (refCount === 0) startTimer();
      refCount = refCount + 1;
    },
    removeRefCount: () => {
      if (refCount <= 1) stopTimer();
      refCount = Math.max(0, refCount - 1);
    },
  };
});

export default useTickStore;
