import { useEffect } from 'react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import SimulationActions, { checkOngoingSimulation, SIMULATION_TIME_LIMIT } from '@/utils/simulation/simulation.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess.ts';

export function useSimulationStatus() {
  const openModal = useSimulationModalStore(state => state.openModal);
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);

  const checkHasSimulation = async () => {
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
      SimulationActions.finish(true);
      alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
      return;
    }

    setCurrentSimulation({
      simulationStatus: 'start',
      simulationId: simulation.simulationId,
      startedAt: start,
    });
  };

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     * 현재 시뮬레이션으로 저장
     */
    checkHasSimulation().then();
  }, []);
}
