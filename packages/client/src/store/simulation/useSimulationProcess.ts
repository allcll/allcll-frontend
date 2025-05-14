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
  isFinished: {
    isFinishedSubject: boolean;
    isSuccessed: 'BEFORE' | 'SUCCESS' | 'FAIL';
  };
}

interface SimulationState {
  simulationId: number;
  userPK: string;
  department: DepartmentType;
  subjects: SimulationSubject[];
  started_simulation_at: number | null;
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
  clickedTime: number;
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  subjectsStatus: SubjectStatus[];
  successedId: number[]; // Define successedId as an array of numbers
  setSuccessedId: (id: number) => void; // Add setSuccessedId method
  setCurrentSimulation: (simulation: Partial<SimulationState>) => void;
  setSubjectsStatus: (
    subjectId: number,
    subjectStatus: APPLY_STATUS,
    isCaptchaFailed?: boolean,
    isFinished?: { isFinishedSubject: boolean; isSuccessed: 'BEFORE' | 'SUCCESS' | 'FAIL' },
  ) => void;
  resetSimulation: () => void;
}

const defaultSimulation: SimulationState = {
  simulationId: -1,
  userPK: '',
  department: { departmentCode: '', departmentName: '' },
  subjects: [],
  started_simulation_at: null,
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before',
  clickedTime: 2,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: defaultSimulation,
  subjectsStatus: [],
  successedId: [],
  setSuccessedId: id =>
    set(state => ({
      successedId: [...state.successedId, id],
    })),
  setSubjectsStatus: (
    subjectId: number,
    subjectStatus: APPLY_STATUS,
    isCaptchaFailed = false,
    isFinished = { isFinishedSubject: false, isSuccessed: 'BEFORE' },
  ) =>
    set(state => {
      const exists = state.subjectsStatus.find(s => s.subjectId === subjectId);

      if (exists) {
        return {
          subjectsStatus: state.subjectsStatus.map(s =>
            s.subjectId === subjectId ? { ...s, subjectStatus, isCaptchaFailed, isFinished } : s,
          ),
        };
      } else {
        return {
          subjectsStatus: [...state.subjectsStatus, { subjectId, subjectStatus, isCaptchaFailed, isFinished }],
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
