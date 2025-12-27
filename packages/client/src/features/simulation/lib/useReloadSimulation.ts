import { getSimulateStatus } from '@/utils/simulation/subjects.ts';
import { findSubjectsById } from '@/utils/subjectPicker.ts';
import { SimulationSubject } from '@/utils/types.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import useLectures from '@/entities/subjects/model/useLectures.ts';

export function useReloadSimulation() {
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const openModal = useSimulationModalStore(state => state.openModal);
  const { data: lectures } = useLectures();

  const loadCurrentSimulation = (
    subjects: { subjectId: number }[],
    key: 'successedSubjects' | 'failedSubjects' | 'registeredSubjects' | 'nonRegisteredSubjects',
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

  const reloadSimulationStatus = () => {
    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) return;

        setCurrentSimulation({ simulationId: result.simulationId });

        if (result?.nonRegisteredSubjects) {
          loadCurrentSimulation(result.nonRegisteredSubjects, 'nonRegisteredSubjects', result.simulationId);
        }

        if (result?.registeredSubjects) {
          loadCurrentSimulation(result.registeredSubjects, 'registeredSubjects', result.simulationId);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return {
    reloadSimulationStatus,
  };
}
