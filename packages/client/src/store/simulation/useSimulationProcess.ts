import { SimulationStatusType, SimulationSubject } from '@/utils/types';
import { create } from 'zustand';
import { Lecture } from '@/hooks/server/useLectures.ts';
import { findLecturesById } from '@/utils/subjectPicker.ts';
import { getSimulateStatus } from '@/utils/simulation/subjects.ts';

export interface SimulationState {
  simulationId: number;
  registeredSubjects: SimulationSubject[];
  nonRegisteredSubjects: SimulationSubject[];
  simulationStatus: SimulationStatusType;
  clickedTime: number;
  startedAt: number;
}

interface IUseSimulationProcessStore {
  currentSimulation: SimulationState;
  setCurrentSimulation: (simulation: Partial<SimulationState>) => void;
  preloadSubjects: (lectures: Lecture[]) => () => void;
  resetSimulation: () => void;
}

export const DefaultSimulation: SimulationState = {
  simulationId: -1,
  registeredSubjects: [],
  nonRegisteredSubjects: [],
  simulationStatus: 'before', // 사용하지 않음
  clickedTime: 0,
  startedAt: 0,
};

const useSimulationProcessStore = create<IUseSimulationProcessStore>(set => ({
  currentSimulation: DefaultSimulation,
  setCurrentSimulation: simulation =>
    set(state => ({
      currentSimulation: { ...state.currentSimulation, ...simulation },
    })),
  /** 시뮬레이션 관련 subject를 미리 로드하고, flush 하는 함수를 반환합니다. */
  preloadSubjects(lectures: Lecture[]) {
    let simulationData: Partial<SimulationState>;

    const getLectures = (subjects: { subjectId: number }[]) => {
      return subjects.map(subject => findLecturesById(lectures, subject.subjectId)).filter(s => !!s);
    };

    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) {
          throw new Error('No Ongoing Simulation');
        }
        const { simulationId, nonRegisteredSubjects, registeredSubjects } = result;

        simulationData = {
          simulationId,
          nonRegisteredSubjects: getLectures(nonRegisteredSubjects ?? []),
          registeredSubjects: getLectures(registeredSubjects ?? []),
        };
      })
      .catch(error => console.error(error));

    return () => {
      set(state => ({
        currentSimulation: { ...state.currentSimulation, ...simulationData },
      }));
    };
  },
  resetSimulation: () => set({ currentSimulation: DefaultSimulation }),
}));

export default useSimulationProcessStore;
