import { useSimulationModalStore } from '@/features/simulation/model/useSimulationModal.ts';
import useSimulationProcessStore from '@/features/simulation/model/useSimulationProcess.ts';
import {
  forceStopSimulation,
  getOngoingSimulation,
  SIMULATION_TIME_LIMIT,
} from '@/features/simulation/lib/simulation.ts';
import { useState, useEffect, useRef } from 'react';

function Stopwatch() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const openModal = useSimulationModalStore(state => state.openModal);
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTime = (totalSeconds: number) => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const forceSimulation = async () => {
    try {
      await forceStopSimulation();
      setCurrentSimulation({ simulationStatus: 'finish' });
      openModal('result');
    } catch (error) {
      console.error(error);
      alert('시뮬레이션 강제 종료에 실패했습니다.');
    }
  };

  useEffect(() => {
    const initTimer = async () => {
      if (currentSimulation.simulationStatus === 'finish') {
        setCurrentTime('00:00');
        return;
      }

      try {
        const result = await getOngoingSimulation();

        const isSimulationOngoing = result?.started_at && result.simulation_run_id === currentSimulation.simulationId;
        if (!isSimulationOngoing) {
          return;
        }

        const start = result.started_at;

        intervalRef.current = setInterval(() => {
          const now = Date.now();
          const seconds = Math.floor((now - start) / 1000);

          if (seconds >= SIMULATION_TIME_LIMIT) {
            clearInterval(intervalRef.current!);
            alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
            forceSimulation().then();
            return;
          }

          getTime(seconds);

          if (currentSimulation.simulationStatus === 'finish') {
            clearInterval(intervalRef.current!);
            setCurrentTime('00:00');
          }
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    };

    initTimer().then();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentSimulation.simulationStatus, currentSimulation.simulationId]);

  return <p className="font-semibold text-xl text-blue-500">{currentTime}</p>;
}

export default Stopwatch;
