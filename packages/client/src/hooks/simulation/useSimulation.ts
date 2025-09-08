import { startSimulation } from '@/utils/simulation/simulation';
import { saveInterestedSnapshot } from '@/utils/simulation/subjects.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import { Lecture } from '@/hooks/server/useLectures.ts';
import { Department } from '@/hooks/server/useDepartments.ts';

function useSimulation() {
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const closeModal = useSimulationModalStore(state => state.closeModal);

  /**시뮬레이션 시작버튼 클릭 */
  const startSimul = async (mode: string, subjects: Lecture[], department: Department) => {
    if (subjects.length === 0) {
      alert('과목 리스트가 비어있습니다. 게임을 시작할 수 없습니다.');
      return;
    }

    try {
      closeModal();

      // Todo: 기존 과목 판별 더 정확하게 할 수 있도록 개선 (시간표 선택 -> 같은 시간표 선택 시 등)
      if (mode !== 'previous') {
        await saveInterestedSnapshot(subjects.map(subject => subject.subjectId));
      }
      const result = await startSimulation('', department.departmentCode, department.departmentName);

      const isStarted =
        'simulationId' in result &&
        'isRunning' in result &&
        result.simulationId !== -1 &&
        result.isRunning !== undefined;

      if (isStarted) {
        const { simulationId, isRunning } = result;

        setCurrentSimulation({
          simulationId,
          simulationStatus: isRunning ? 'start' : 'before',
        });
      } else {
        console.error('시뮬레이션 시작 결과가 유효하지 않음', result);
      }
    } catch (e) {
      console.error('시뮬레이션 시작 중 오류 발생:', e);
    }
  };

  return { startSimulation: startSimul };
}

export default useSimulation;
