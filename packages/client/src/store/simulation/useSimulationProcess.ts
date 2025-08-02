import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface SubjectStatus {
  subjectId: number;
  subjectStatus: APPLY_STATUS;
}

interface SimulationState {
  simulationId: number;
  simulatonSubjects: SimulationSubject[];
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  successedSubjects: SimulationSubject[];
  failedSubjects: SimulationSubject[];
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
  simulatonSubjects: [],
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  successedSubjects: [],
  failedSubjects: [],
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
