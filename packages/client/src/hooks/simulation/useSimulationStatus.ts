import { useEffect } from 'react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';
import { checkOngoingSimulation, forceStopSimulation, SIMULATION_TIME_LIMIT } from '@/utils/simulation/simulation.ts';
import { useReloadSimulation } from './useReloadSimulation.ts';

export function useSimulationStatus() {
  const { openModal } = useSimulationModalStore();
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();
  const { reloadSimulationStatus } = useReloadSimulation();

  const forceSimulation = async () => {
    try {
      await forceStopSimulation();
      setCurrentSimulation({ simulationStatus: 'finish' });
      alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
      openModal('result');
    } catch (error) {
      console.error(error);
      alert('시뮬레이션 강제 종료에 실패했습니다.');
    }
  };

  const checkHasSimulation = async () => {
    const simulation = await checkOngoingSimulation();
    if (simulation && 'simulationId' in simulation && simulation.simulationId !== -1) {
      const start = simulation.startedAt;
      if (!start) {
        return;
      }
      const now = Date.now();
      const seconds = Math.floor((now - start) / 1000);

      if (seconds > SIMULATION_TIME_LIMIT) {
        await forceSimulation();
      } else {
        await reloadSimulationStatus();
      }
    } else if (currentSimulation.simulationStatus === 'before') {
      openModal('tutorial');
    }
  };

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     * 현재 시뮬레이션으로 저장
     */
    checkHasSimulation().then();
  }, [currentSimulation.simulationStatus]);
}
