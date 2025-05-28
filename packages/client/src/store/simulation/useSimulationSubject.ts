import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { create } from 'zustand';

interface IUseSimulationSubjectStore {
  currentSubjectId: number;
  ended_subject_at: number | null;
  subjectStatusMap: Record<string, APPLY_STATUS>;
  setCurrentSubjectId: (currentSubjectId: number) => void;
  setSubjectStatus: (currentSubjectId: number, status: APPLY_STATUS) => void;
  getSubjectStatus: (subjectId: string) => APPLY_STATUS | undefined;
  stopTimer: () => void;
  getElapsedTime: () => number;
}

const useSimulationSubjectStore = create<IUseSimulationSubjectStore>((set, get) => ({
  currentSubjectId: 0,
  ended_subject_at: null,
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
  stopTimer: () =>
    set({
      ended_subject_at: Date.now(),
    }),
  getElapsedTime: () => {
    const { ended_subject_at } = get();
    return ended_subject_at ? Date.now() - ended_subject_at : 0;
  },
}));

export default useSimulationSubjectStore;
