import { useState, useEffect } from 'react';
import { db, SimulationRun } from '@/utils/dbConfig';

/**
 * 시뮬레이션 리스트를 불러옵니다.
 * @returns 시뮬레이션 목록과 로딩 함수를 제공합니다.
 */
export function useDashboardList() {
  const [simulations, setSimulations] = useState<SimulationRun[] | null>(null);

  useEffect(() => {
    db.simulation_run.toArray().then(data => {
      setSimulations(data);
      console.log('simulate data', data);
    });
  }, []);

  const isPending = simulations === null;
  const isError = !isPending && simulations === null;

  return { data: simulations, isPending, isError };
}

/**
 * 시뮬레이션 결과를 불러옵니다.
 * @returns 결과 및 로딩 함수를 제공합니다.
 */
export function useDashboardResults() {
  const [results, setResults] = useState<SimulationRun[] | null>(null);

  useEffect(() => {
    db.simulation_run.toArray().then(data => {
      setResults(data);
    });
  }, []);

  const isPending = results === null;
  const isError = !isPending && results === null;

  return { data: results, isPending, isError };
}
