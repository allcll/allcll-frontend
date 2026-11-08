import { SimulationStatusType, SimulationSubject } from '@/shared/model/types.ts';
import { create } from 'zustand';

interface SimulationState {
  simulationId: number;
  registeredSubjects: SimulationSubject[]; // 신청 학점 수 판별...
  nonRegisteredSubjects: SimulationSubject[]; // failedSubjects 랑 같이 씀.
  simulationStatus: SimulationStatusType; // 전역적으로 상태 판단 (동기 + 비동기 상태 둘 다 일것 같은데 확인 필요)
  clickedTime: number; // 검색 버튼 클릭한 시간 (밀리초) - 대기시간 판별 용
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
