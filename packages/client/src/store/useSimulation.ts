import { SimulationSubject } from '@/utils/types';
import { create } from 'zustand';

interface IUseSimulationSubject {
  subjects: SimulationSubject[];
  setSubjects: (subjects: SimulationSubject[]) => void;
}

const useSimulation = create<IUseSimulationSubject>(set => ({
  subjects: [],
  setSubjects: subjects =>
    set(() => ({
      subjects,
    })),
}));

export default useSimulation;
