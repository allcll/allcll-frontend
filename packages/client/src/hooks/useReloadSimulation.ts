import { getSimulateStatus } from '@/utils/simulation/subjects';
import { findSubjectsById } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';

export function useReloadSimulation() {
  const { setCurrentSimulation } = useSimulationProcessStore();

  const loadCurrentSimulation = (
    subjects: { subjectId: number }[],
    key: 'nonRegisteredSubjects' | 'registeredSubjects',
    simulationId: number,
  ) => {
    const filteredSubjects = subjects
      .map(subject => findSubjectsById(subject.subjectId))
      .filter((subject): subject is SimulationSubject => subject !== undefined);

    setCurrentSimulation({
      simulationId: simulationId,
      [key]: filteredSubjects,
    });
  };

  const reloadSimulationStatus = () => {
    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) return;

        setCurrentSimulation({
          simulationId: result.simulationId,
          department: {
            departmentCode: result?.userStatus?.departmentCode ?? '',
            departmentName: result?.userStatus?.departmentName ?? '',
          },
        });

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
