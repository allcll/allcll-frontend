import { useCallback } from 'react';
import useSimulationProcessStore, { DefaultSimulation } from '@/store/simulation/useSimulationProcess';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import SnapshotService from '@/utils/simulation/SnapshotService.ts';
import {
  startSimulation,
  forceStopSimulation,
  endCurrentSimulation,
  BUTTON_EVENT,
  checkOngoingSimulation,
  SIMULATION_TIME_LIMIT,
} from '@/utils/simulation/simulation';
import { Lecture } from '@/hooks/server/useLectures';
import { Department } from '@/hooks/server/useDepartments';

export const useSimulationActions = () => {
  const { setCurrentSimulation } = useSimulationProcessStore();
  const { openModal, closeModal } = useSimulationModalStore();

  /** 시뮬레이션을 초기 세팅합니다 */
  const init = useCallback(async () => {
    const simulation = await checkOngoingSimulation();

    const isStarted = simulation && 'simulationId' in simulation && simulation.simulationId !== -1;
    if (!isStarted) {
      openModal('tutorial');
      return;
    }

    const start = simulation.startedAt ?? 0;
    const now = Date.now();
    const seconds = Math.floor((now - start) / 1000);

    if (seconds > SIMULATION_TIME_LIMIT) {
      finish(true);
      alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
      return;
    }

    setCurrentSimulation({
      simulationStatus: 'start',
      simulationId: simulation.simulationId,
      startedAt: start,
    });
  }, []);

  /**
   * 새로운 시뮬레이션을 시작합니다.
   * @param mode 'previous'가 아니면 새로운 관심과목 스냅샷을 저장합니다.
   * @param subjects 시작할 과목 목록
   * @param department 학과 정보
   */
  const start = useCallback(
    async (mode: string, subjects: Lecture[], department: Department) => {
      if (subjects.length === 0) {
        alert('과목 리스트가 비어있습니다. 게임을 시작할 수 없습니다.');
        return;
      }

      try {
        closeModal();

        if (mode !== 'previous') {
          await SnapshotService.save(subjects.map(subject => subject.subjectId));
        }
        const result = await startSimulation('', department.departmentCode, department.departmentName);

        const isStarted =
          'simulationId' in result &&
          'isRunning' in result &&
          result.simulationId !== -1 &&
          result.isRunning !== undefined;

        if (isStarted) {
          const { simulationId, started_at, isRunning } = result;

          setCurrentSimulation({
            simulationId,
            startedAt: started_at,
            simulationStatus: isRunning ? 'start' : 'before',
          });
        } else {
          console.error('시뮬레이션 시작 결과가 유효하지 않음', result);
        }
      } catch (e) {
        console.error('시뮬레이션 시작 중 오류 발생:', e);
      }
    },
    [closeModal, setCurrentSimulation],
  );

  /**
   * 재조회 로직을 실행합니다. (UI 상태 변경)
   */
  const update = useCallback(() => {
    setCurrentSimulation({ registeredSubjects: [], nonRegisteredSubjects: [] });
    openModal('waiting');
  }, [setCurrentSimulation, openModal]);

  /**
   * 시뮬레이션을 종료합니다.
   * @param force true일 경우 강제 종료 로직을 실행합니다.
   */
  const finish = useCallback(
    (force = false) => {
      const action = force ? forceStopSimulation : endCurrentSimulation;
      action()
        .catch(e => {
          console.error(e);
          alert(e);
        })
        .finally(() => {
          const { simulationId, ...rest } = DefaultSimulation;
          setCurrentSimulation({ ...rest, simulationStatus: 'finish' });
          openModal('result');
        });
    },
    [setCurrentSimulation, openModal],
  );

  /** 버튼 이벤트를 발생시킵니다 */
  const click = useCallback(async (eventType: BUTTON_EVENT, subjectId?: number) => {
    // todo: triggerButtonEvent 호출 로직 구현
    // 예시: await triggerButtonEvent({ eventType, subjectId }, lectures);
  }, []);

  /** 과목을 신청하고 결과를 반환합니다 */
  const submitSubject = useCallback(async (subjectId: number) => {
    // todo: triggerButtonEvent 호출 로직 구현
    // 예시: const result = await triggerButtonEvent({ eventType: BUTTON_EVENT.SUBJECT_SUBMIT, subjectId }, lectures);
  }, []);

  /** simulation이 종료되었는지 확인하고, 종료 시, 종료 로직을 실행합니다. */
  const checkFinish = useCallback(() => {
    // todo: checkSimulationFinish 호출 로직 구현
  }, []);

  return {
    init,
    start,
    update,
    finish,
    click,
    submitSubject,
    checkFinish,
  };
};
