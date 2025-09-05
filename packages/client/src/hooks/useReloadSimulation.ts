import { getSimulateStatus } from '@/utils/simulation/subjects';
import { findSubjectsById } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useLectures from './server/useLectures';

export function useReloadSimulation() {
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const openModal = useSimulationModalStore(state => state.openModal);
  const { data: lectures } = useLectures();

  const loadCurrentSimulation = (
    subjects: { subjectId: number }[],
    key: 'registeredSubjects' | 'nonRegisteredSubjects',
    simulationId: number,
  ) => {
    const filteredSubjects = subjects
      .map(subject => findSubjectsById(lectures, subject.subjectId))
      .filter((subject): subject is SimulationSubject => subject !== undefined);

    setCurrentSimulation({
      simulationId: simulationId,
      [key]: filteredSubjects,
    });

    if (currentSimulation.simulationStatus === 'progress') {
      openModal('waiting');
    }
  };

  const reloadSimulationStatus = async () => {
    try {
      const result = await getSimulateStatus();
      if (!result || result.simulationId === -1) return;

      const { simulationId, nonRegisteredSubjects, registeredSubjects } = result;

      setCurrentSimulation({ simulationId });

      if (nonRegisteredSubjects) {
        loadCurrentSimulation(nonRegisteredSubjects, 'nonRegisteredSubjects', simulationId);
      }

      if (registeredSubjects) {
        loadCurrentSimulation(registeredSubjects, 'registeredSubjects', simulationId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { reloadSimulationStatus };
}
