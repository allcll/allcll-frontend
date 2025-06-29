import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { DepartmentType, SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface SubjectStatus {
  subjectId: number;
  subjectStatus: APPLY_STATUS;
  isCaptchaFailed: boolean;
}

interface SimulationState {
  simulationId: number;
  department: DepartmentType;
  simulatonSubjects: SimulationSubject[];
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
  clickedTime: number;
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  subjectsStatus: SubjectStatus[];
  setCurrentSimulation: (simulation: Partial<SimulationState>) => void;
  resetSimulation: () => void;
}

const defaultSimulation: SimulationState = {
  simulationId: -1,
  department: { departmentCode: '', departmentName: '' },
  simulatonSubjects: [],
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before',
  clickedTime: 0,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: defaultSimulation,
  subjectsStatus: [],
  setCurrentSimulation: simulation =>
    set(state => ({
      currentSimulation: { ...state.currentSimulation, ...simulation },
    })),
  resetSimulation: () => set({ currentSimulation: defaultSimulation, subjectsStatus: [] }),
}));

export default useSimulationProcessStore;
