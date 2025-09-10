import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

export interface SimulationState {
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

export const DefaultSimulation: SimulationState = {
  simulationId: -1,
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before',
  clickedTime: 0,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: DefaultSimulation,
  setCurrentSimulation: simulation =>
    set(state => ({
      currentSimulation: { ...state.currentSimulation, ...simulation },
    })),
  resetSimulation: () => set({ currentSimulation: DefaultSimulation }),
}));

export default useSimulationProcessStore;
