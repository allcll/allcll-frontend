// sse conditional global state
import { create } from 'zustand';

export const RELOAD_INTERVAL = 1.5 * 1000;
export const RELOAD_MAX_COUNT = 5;

interface ISSECondition {
  isInitialized: boolean;
  needCount: number;
  alwaysReload: boolean;
  forceReloadNumber: number;
  isError: boolean;
  isPending: boolean;
  endInitialized: () => void;
  addNeedCount: () => void;
  deleteNeedCount: () => void;
  setAlwaysReload: (alwaysReload: boolean) => void;
  setForceReload: () => void;
  errorCount: number;
  setError: () => void;
  resetError: () => void;
}

const useSSECondition = create<ISSECondition>(set => ({
  isInitialized: false,
  needCount: 0,
  alwaysReload: false,
  forceReloadNumber: 0,
  errorCount: 0,
  isError: false,
  isPending: true,
  endInitialized: () => set({ isInitialized: true }),
  addNeedCount: () => set(state => ({ needCount: state.needCount + 1 })),
  deleteNeedCount: () => set(state => ({ needCount: Math.max(0, state.needCount - 1) })),
  setAlwaysReload: (alwaysReload: boolean) => set({ alwaysReload }),
  setForceReload: () =>
    set(state => ({ forceReloadNumber: state.forceReloadNumber + 1, errorCount: 0, isError: false })),
  setError: () =>
    set(({ errorCount, isPending }) => ({
      errorCount: errorCount + 1,
      isError: errorCount + 1 >= RELOAD_MAX_COUNT,
      isPending: isPending || errorCount > 1,
    })),
  resetError: () => set({ errorCount: 0, isError: false, isPending: false }),
}));

export default useSSECondition;
