// sse conditional global state
import { create } from 'zustand';

export const RELOAD_INTERVAL = 1.5 * 1000;
export const RELOAD_MAX_COUNT = 5;

interface ISSECondition {
  /** SSE 데이터가 필요한 컴포넌트 수*/
  needCount: number;
  /** 백그라운드에서 SSE를 계속 유지할지 여부 */
  alwaysReload: boolean;
  forceReloadNumber: number;
  isError: boolean;
  isPending: boolean;
  addNeedCount: () => void;
  deleteNeedCount: () => void;
  setAlwaysReload: (alwaysReload: boolean) => void;
  setForceReload: () => void;
  errorCount: number;
  setError: () => void;
  resetError: () => void;
}

const useSSECondition = create<ISSECondition>(set => ({
  needCount: 0,
  alwaysReload: false,
  forceReloadNumber: 0,
  errorCount: 0,
  isError: false,
  isPending: true,
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

/* useSSECondition 사용되는 곳 정리 (State 정리 목적)
- useNotification.ts
  - alwaysReload
  - setAlwaysReload
- useSSEManager.ts
  - needCount
  - alwaysReload
  - forceReloadNumber
  - isError: state
  - isPending: state
  - addNeedCount
  - deleteNeedCount
  - setForceReload: state
  - errorCount
  - setError
  - resetError
* */

export default useSSECondition;
