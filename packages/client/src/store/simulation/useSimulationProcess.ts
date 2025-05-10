import { SimulationStatusType, SimulationSubject, SubjectStatusType } from '@/utils/types';
import { create } from 'zustand';

interface DepartmentType {
  departmentCode: string;
  departmentName: string;
}

interface SubjectStatus {
  subjectId: number;
  subjectStatus: SubjectStatusType;
  isCaptchaFailed: boolean;
}

interface SimulationState {
  simulationId: string;
  department: DepartmentType;
  subjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
}

interface IUseSimulationProcessStore {
  simulation: SimulationState;
  subjectsStatus: SubjectStatus[];
  setSimulation: (simulation: Partial<SimulationState>) => void;
  setSubjectsStatus: (subjectId: number, subjectStatus: SubjectStatusType, isCaptchaFailed?: boolean) => void;
  resetSimulation: () => void;
}

const defaultSimulation: SimulationState = {
  simulationId: '',
  department: { departmentCode: '', departmentName: '' },
  subjects: [],
  simulationStatus: 'before',
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  simulation: defaultSimulation,
  subjectsStatus: [],
  setSubjectsStatus: (subjectId, subjectStatus, isCaptchaFailed = false) =>
    set(state => {
      const exists = state.subjectsStatus.find(s => s.subjectId === subjectId);

      if (exists) {
        return {
          subjectsStatus: state.subjectsStatus.map(s =>
            s.subjectId === subjectId ? { ...s, subjectStatus, isCaptchaFailed } : s,
          ),
        };
      } else {
        return {
          subjectsStatus: [...state.subjectsStatus, { subjectId, subjectStatus, isCaptchaFailed }],
        };
      }
    }),

  setSimulation: simulation =>
    set(state => ({
      simulation: { ...state.simulation, ...simulation },
    })),
  resetSimulation: () => set({ simulation: defaultSimulation }),
}));

export default useSimulationProcessStore;
