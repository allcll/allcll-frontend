import { getSimulateStatus } from '@/utils/simulation/subjects';
import { findSubjectsById } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useLectures from './server/useLectures';

export function useReloadSimulation() {
  const { setCurrentSimulation, currentSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
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

  function getSubjectsWithStatusSuccess(
    registeredSubjects: { subjectId: number }[],
    key: 'successedSubjects' | 'failedSubejcts',
    subjectStatus: { subjectId: number; status: number }[],
  ) {
    if (key === 'successedSubjects') {
      const statusSuccessedIds = subjectStatus.filter(status => status.status === 1).map(status => status.subjectId);
      return registeredSubjects.filter(subject => statusSuccessedIds.includes(subject.subjectId));
    } else {
      const statusFailedIds = subjectStatus.filter(status => status.status === 2).map(status => status.subjectId);
      return registeredSubjects.filter(subject => statusFailedIds.includes(subject.subjectId));
    }
  }

  const reloadSimulationStatus = () => {
    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) return;

        setCurrentSimulation({
          simulationId: result.simulationId,
        });

        if (result?.nonRegisteredSubjects) {
          loadCurrentSimulation(result.nonRegisteredSubjects, 'nonRegisteredSubjects', result.simulationId);
        }

        if (result?.registeredSubjects) {
          const filteredSuccessedSubjects = getSubjectsWithStatusSuccess(
            result.registeredSubjects,
            'successedSubjects',
            result.subjectStatus,
          );

          const filteredFailedSubjects = getSubjectsWithStatusSuccess(
            result.registeredSubjects,
            'failedSubejcts',
            result.subjectStatus,
          );

          loadCurrentSimulation(filteredSuccessedSubjects, 'successedSubjects', result.simulationId);
          loadCurrentSimulation(filteredFailedSubjects, 'failedSubjects', result.simulationId);
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
