import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface SimulationState {
  simulationId: number;
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
  clickedTime: number;
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  setCurrentSimulation: (simulation: Partial<SimulationState>) => void;
  resetSimulation: () => void;
}

const defaultSimulation: SimulationState = {
  simulationId: -1,
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before',
  clickedTime: 0,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: defaultSimulation,
  setCurrentSimulation: simulation =>
    set(state => ({
      currentSimulation: { ...state.currentSimulation, ...simulation },
    })),
  resetSimulation: () => set({ currentSimulation: defaultSimulation /*, subjectsStatus: []*/ }),
}));

export default useSimulationProcessStore;
