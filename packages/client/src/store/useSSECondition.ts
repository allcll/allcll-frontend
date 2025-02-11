// sse conditional global state
import { create } from 'zustand';

interface ISSECondition {
  needCount: number;
  alwaysReload: boolean;
  forceReloadNumber: number;
  isError: boolean;
  addNeedCount: () => void;
  deleteNeedCount: () => void;
  setAlwaysReload: (alwaysReload: boolean) => void;
  setForceReload: () => void;
  setError: (isError: boolean) => void;
}

const useSSECondition = create<ISSECondition>((set) => ({
  needCount: 0,
  alwaysReload: false,
  forceReloadNumber: 0,
  isError: false,
  addNeedCount: () => set((state) => ({ needCount: state.needCount + 1 })),
  deleteNeedCount: () => set((state) => ({ needCount: Math.max(0, state.needCount - 1) })),
  setAlwaysReload: (alwaysReload: boolean) => set({ alwaysReload }),
  setForceReload: () => set((state) => ({ forceReloadNumber: state.forceReloadNumber + 1 })),
  setError: (isError: boolean) => set({ isError }),
}));

export default useSSECondition;