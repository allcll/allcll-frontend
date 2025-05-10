import { SubjectStatusType } from '@/utils/types';
import { create } from 'zustand';

interface IUseSimulationSubjectStore {
  currentSubjectId: number;
  subjectStatusMap: Record<string, SubjectStatusType>;
  setCurrentSubjectId: (currentSubjectId: number) => void;
  setSubjectStatus: (currentSubjectId: number, status: SubjectStatusType) => void;
  getSubjectStatus: (subjectId: string) => SubjectStatusType | undefined;
}

const useSimulationSubjectStore = create<IUseSimulationSubjectStore>((set, get) => ({
  currentSubjectId: 0,
  subjectStatusMap: {},
  setCurrentSubjectId: (currentSubjectId: number) => set({ currentSubjectId: currentSubjectId }),
  setSubjectStatus: (currentSubjectId, status) =>
    set(state => ({
      subjectStatusMap: {
        ...state.subjectStatusMap,
        [currentSubjectId]: status,
      },
    })),
  getSubjectStatus: currentSubjectId => get().subjectStatusMap[currentSubjectId],
}));

export default useSimulationSubjectStore;
