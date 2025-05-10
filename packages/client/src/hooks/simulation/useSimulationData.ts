/**
 * 관심과목 필요한 기능
 * - 관심과목 리스트 Read
 * - 관심과목을 Create 기능
 * - 관심과목을 Delete 기능
 * - 최근 관심과목 스냅샷 Read
 * - 관심과목에 대한 새로운 스냅샷 Create(저장) 기능
 *
 * 시뮬레이션 필요한 기능
 * - 시뮬레이션 Create(시작) 기능
 * - 시뮬레이션 종료 + 결과 Update(저장) 기능
 * - 버튼 클릭시 이벤트 Create 기능 (ENUM 필요)
 *
 * 대시보드 필요한 기능
 * - 시뮬레이션 리스트 Read
 * - 시뮬레이션 결과 능력치 Read
 * - 시뮬레이션 과목별 타임라인 Read
 * - 시뮬레이션 과목별 결과 Read
 * */

import { useState } from 'react';
import { db, SimulationRun, SimulationRunEvents } from '@/utils/dbConfig';
import { BUTTON_EVENT } from '@/utils/simulation/simulation.ts';

/** @deprecated*/
export interface IndexDBQuery<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

/** @deprecated*/
export interface IndexDBMutation<T> {
  mutate: (data?: T) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * 시뮬레이션을 시작합니다.
 * @deprecated
 * @returns 시작 함수를 제공합니다.
 */
export function useSimulationStart(): IndexDBMutation<SimulationRun> {
  const [isSuccess, setIsSuccess] = useState(false);

  const startSimulation = async () => {
    setIsSuccess(false);
    const recent = await db.interested_snapshot.orderBy('created_at').last();
    if (!recent) throw new Error('No recent snapshot found');

    const subjects = await db.interested_subject.toArray();
    await db.simulation_run.add({
      snapshot_id: recent.snapshot_id,
      user_id: 'Todo: user_id',
      success_subject_count: 0,
      subject_count: subjects.length,
      accuracy: 0,
      score: 0,
      total_elapsed: 0,
      search_event_at: 0,
      started_at: Date.now(),
      ended_at: -1,
    });
    setIsSuccess(true);
  };

  return {
    mutate: () => startSimulation().then(),
    isLoading: !isSuccess,
    isError: false,
    isSuccess,
  };
}

/**
 * 시뮬레이션을 종료하고 결과를 업데이트합니다.
 * @deprecated
 * @returns 종료 함수를 제공합니다.
 */
export function useSimulationEnd(): IndexDBMutation<SimulationRun> {
  const [isSuccess, setIsSuccess] = useState(false);

  const endSimulation = async () => {
    const runs = await db.simulation_run.toArray();
    if (!runs.length) return;
    const lastRun = runs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0];
    lastRun.ended_at = Date.now();
    await db.simulation_run.put(lastRun);
    setIsSuccess(true);
  };

  return {
    mutate: () => endSimulation().then(),
    isLoading: !isSuccess,
    isError: false,
    isSuccess,
  };
}

// enum SimulationRunEventsType {
//
// }

/**
 * 버튼 클릭 시 이벤트를 생성합니다.
 * @deprecated
 * @returns 이벤트 생성 함수를 제공합니다.
 */
export function useButtonEvent(): IndexDBMutation<SimulationRunEvents> {
  const [isSuccess, setIsSuccess] = useState(false);

  const createButtonEvent = async (eventType: BUTTON_EVENT) => {
    await db.simulation_run_events.add({
      simulation_section_id: 0,
      event_type: eventType,
      timestamp: Date.now(),
    });
    setIsSuccess(true);
  };

  return {
    mutate: (data?: SimulationRunEvents) => {
      if (!data) return;
      return createButtonEvent(data.event_type).then();
    },
    isLoading: !isSuccess,
    isError: false,
    isSuccess,
  };
}
