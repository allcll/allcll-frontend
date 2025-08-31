import { APPLY_STATUS } from '@/utils/simulation/simulation';
import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface SubjectStatus {
  subjectId: number;
  subjectStatus: APPLY_STATUS;
}

interface SimulationState {
  simulationId: number;
  simulatonSubjects: SimulationSubject[]; // 안씀 (불러오는 로직만 있음)
  registeredSubjects: SimulationSubject[]; // 신청 학점 수 판별...
  nonRegisteredSubjects: SimulationSubject[]; // failedSubjects 랑 같이 씀.
  successedSubjects: SimulationSubject[]; // 신청학점 판단, registeredSubjects 동일.
  failedSubjects: SimulationSubject[]; // non-registered 제대로 판단할 때 씀.
  simulationStatus: SimulationStatusType; // 전역적으로 상태 판단 (동기 + 비동기 상태 둘 다 일것 같은데 확인 필요)
  clickedTime: number; // 검색 버튼 클릭한 시간 (밀리초) - 대기시간 판별 용
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  subjectsStatus: SubjectStatus[]; // 안씀
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
