import { useState, useEffect } from 'react';
import { useSimulationActions } from '@/hooks/simulation/useSimulationActions.ts';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { SIMULATION_TIME_LIMIT } from '@/utils/simulation/simulation';

function Stopwatch() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const SimulationActions = useSimulationActions();
  const { startedAt } = currentSimulation;

  const setTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const finish = () => {
      if (interval) clearInterval(interval);
      setCurrentTime('00:00');
    };

    const isSimulationNotStarted = startedAt <= 0;
    if (isSimulationNotStarted) {
      finish();
      return;
    }

    interval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startedAt) / 1000);

      // Fixme: 이거 여기에서 안하는게 좋을 것 같음. (관심사 분리)
      if (seconds >= SIMULATION_TIME_LIMIT) {
        finish();
        SimulationActions.finish(true);
        alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
        return;
      }

      setTime(seconds);
    }, 500);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startedAt]);

  return <p className="font-semibold text-xl text-blue-500">{currentTime}</p>;
}

export default Stopwatch;
