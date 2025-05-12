import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface DepartmentType {
  departmentCode: string;
  departmentName: string;
}

interface SubjectStatus {
  subjectId: number;
  subjectStatus: APPLY_STATUS;
  isCaptchaFailed: boolean;
}

interface SimulationState {
  simulationId: number;
  department: DepartmentType;
  subjects: SimulationSubject[];
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
  clickedTime: number;
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  subjectsStatus: SubjectStatus[];
  setCurrentSimulation: (simulation: Partial<SimulationState>) => void;
  setSubjectsStatus: (subjectId: number, subjectStatus: APPLY_STATUS, isCaptchaFailed?: boolean) => void;
  resetSimulation: () => void;
}

const defaultSimulation: SimulationState = {
  simulationId: -1,
  department: { departmentCode: '', departmentName: '' },
  subjects: [],
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before',
  clickedTime: 2,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: defaultSimulation,
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

  setCurrentSimulation: simulation =>
    set(state => ({
      currentSimulation: { ...state.currentSimulation, ...simulation },
    })),
  resetSimulation: () => set({ currentSimulation: defaultSimulation, subjectsStatus: [] }),
}));

export default useSimulationProcessStore;
