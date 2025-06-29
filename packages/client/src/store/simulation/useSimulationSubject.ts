import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { create } from 'zustand';

interface IUseSimulationSubjectStore {
  currentSubjectId: number;
  subjectStatusMap: Record<string, APPLY_STATUS>;
  isCaptchaFailed: boolean;
  setCurrentSubjectId: (currentSubjectId: number) => void;
  setSubjectStatus: (currentSubjectId: number, status: APPLY_STATUS) => void;
  getSubjectStatus: (subjectId: string) => APPLY_STATUS | undefined;
  getIsCaptchaFailed: () => boolean;
  setCaptchaFailed: (failed: boolean) => void;
}

const useSimulationSubjectStore = create<IUseSimulationSubjectStore>((set, get) => ({
  currentSubjectId: 0,
  ended_subject_at: null,
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
  getSubjectStatus: currentSubjectId => get().subjectStatusMap[currentSubjectId],
  getIsCaptchaFailed: () => get().isCaptchaFailed,
  setCaptchaFailed: failed => set({ isCaptchaFailed: failed }),
}));

export default useSimulationSubjectStore;
