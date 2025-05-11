import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { create } from 'zustand';

interface IUseSimulationSubjectStore {
  currentSubjectId: number;
  started_at: number | null;
  ended_at: number | null;

  subjectStatusMap: Record<string, APPLY_STATUS>;
  setCurrentSubjectId: (currentSubjectId: number) => void;
  setSubjectStatus: (currentSubjectId: number, status: APPLY_STATUS) => void;
  getSubjectStatus: (subjectId: string) => APPLY_STATUS | undefined;
  startTimer: () => void;
  stopTimer: () => void;
  getElapsedTime: () => number;
}

const useSimulationSubjectStore = create<IUseSimulationSubjectStore>((set, get) => ({
  currentSubjectId: 0,
  started_at: null,
  ended_at: null,
  subjectStatusMap: {},

  setCurrentSubjectId: (currentSubjectId: number) => set({ currentSubjectId }),

  setSubjectStatus: (currentSubjectId, status) =>
    set(state => ({
      subjectStatusMap: {
        ...state.subjectStatusMap,
        [currentSubjectId]: status,
      },
    })),

  getSubjectStatus: currentSubjectId => get().subjectStatusMap[currentSubjectId],
  startTimer: () => set({ started_at: Date.now(), ended_at: null }),
  stopTimer: () =>
    set({
      ended_at: Date.now(),
    }),
  getElapsedTime: () => {
    const { started_at, ended_at } = get();
    if (started_at && ended_at) {
      return Math.floor((ended_at - started_at) / 1000);
    }
    return 0;
  },
}));

export default useSimulationSubjectStore;
