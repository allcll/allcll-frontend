import { APPLY_STATUS } from '@/features/simulation/lib/simulation.ts';
import { create } from 'zustand';

interface IUseSimulationSubjectStore {
  currentSubjectId: number;
  subjectStatusMap: Record<string, APPLY_STATUS>;
  isCaptchaFailed: boolean;
  setCurrentSubjectId: (currentSubjectId: number) => void;
  setSubjectStatus: (currentSubjectId: number, status: APPLY_STATUS) => void;
  setCaptchaFailed: (failed: boolean) => void;
}

const useSimulationSubjectStore = create<IUseSimulationSubjectStore>(set => ({
  currentSubjectId: 0,
  isCaptchaFailed: false,
  subjectStatusMap: {},
  setCurrentSubjectId: (currentSubjectId: number) => set({ currentSubjectId }),
  setSubjectStatus: (currentSubjectId, status) =>
    set(state => ({
      subjectStatusMap: {
        ...state.subjectStatusMap,
        [currentSubjectId]: status,
      },
    })),
  setCaptchaFailed: failed => set({ isCaptchaFailed: failed }),
}));

export default useSimulationSubjectStore;
