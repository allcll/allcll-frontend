import { db, SimulationRunSelections } from '@/shared/config/dbConfig.ts';
import { getInterestedSnapshotById } from '@/features/simulation/lib/subjects.ts';
import { APPLY_STATUS, BUTTON_EVENT, getSimulationById } from '@/features/simulation/lib/simulation.ts';

const SEC = 1 / 1000;

export async function getSimulationList() {
  const snapshots = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();
  const sortedSnapshots = snapshots.sort((a, b) => b.simulation_run_id - a.simulation_run_id);

  return {
    snapshots: sortedSnapshots,
  };
}

export interface ResultResponse {
  started_at: number;
  ended_at: number;
  user_ability: {
    searchBtnSpeed: number;
    totalSpeed: number;
    accuracy: number;
    captchaSpeed: number;
  };
  timeline: {
    interested_id: number;
    subject_id: number;
    started_at: number;
    ended_at: number;
    status: number;
    events: {
      event: BUTTON_EVENT;
      timestamp: number;
    }[];
  }[];
  subject_results: {
    interested_id: number;
    subject_id: number;
    selected_index: number;
    ended_at: number;
    status: number;
  }[];
}

/**
 * 1. 사용자 능력 분석 (Radar Chart):
 * 신청 버튼 클릭 속도
 *
 * 총 소요 시간
 *
 * 정확도
 *
 * 합격 인증 속도
 * 👉 simulation_run 테이블의 total_elapsed, accuracy, score 등이 활용됨
 *
 * 2. 과목 별 수강 신청 담은 사람 (Table):
 * 학수번호, 과목명, 교수명, 순위, 관심시간, 관심, 성공/실패
 * 👉 interested_subject, simulation_run_selections, simulation_run, simulation_run_events의 조합 필요
 *
 * 3. 신청 Timeline (Bar):
 * 과목별 클릭 시점, 입력 완료 시간
 * 👉 simulation_run_selections의 started_at, ended_at 활용
 * */
export async function getSimulationResult(simulationId: number): Promise<ResultResponse | null> {
  const simulation = await getSimulationById(simulationId);
  const snapshots = await getInterestedSnapshotById(simulation.snapshot_id);

  if (!simulation || !snapshots) return null;

  const selections = await db.simulation_run_selections
    .where('simulation_run_id')
    .equals(simulation.simulation_run_id)
    .toArray();
  const selectionIds = selections.map(s => s.run_selections_id);

  // const events = await db.simulation_run_events
  //   .filter(e => selections.some(s => s.run_selections_id === e.simulation_section_id))
  //   .toArray();

  const getSubjectId = (interestedId: number) => {
    const interested = snapshots.subjects.find(i => i.interested_id === interestedId);
    return interested ? interested.subject_id : -1;
  };

  const simulationEvents = await db.simulation_run_events
    .filter(e => selectionIds.includes(e.simulation_section_id))
    .toArray();

  const captchaEvents = simulationEvents.filter(e => e.event_type === BUTTON_EVENT.CAPTCHA);

  const getCaptchaSpeed =
    selections.reduce((acc, selection) => {
      const thatEvent = captchaEvents.find(e => e.simulation_section_id === selection.run_selections_id);

      if (thatEvent?.timestamp) {
        return acc + thatEvent.timestamp - selection.started_at;
      }
      return acc;
    }, 0) / selections.length;

  // Todo: 정확한 점수화 기준 필요
  return {
    started_at: simulation.started_at,
    ended_at: simulation.ended_at,

    user_ability: {
      searchBtnSpeed: (simulation.search_event_at - simulation.started_at) / 1000,
      totalSpeed: simulation.total_elapsed / simulation.subject_count / 1000,
      accuracy: simulation.accuracy,
      captchaSpeed: getCaptchaSpeed / 1000,
    },

    timeline: selections.map(s => ({
      interested_id: s.interested_id,
      subject_id: getSubjectId(s.interested_id),
      started_at: s.started_at,
      ended_at: s.ended_at,
      status: s.status,
      events: simulationEvents
        .filter(e => e.simulation_section_id === s.run_selections_id)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(e => ({ event: e.event_type, timestamp: e.timestamp })),
    })),

    subject_results: selections
      .sort((s1, s2) => s2.started_at - s1.started_at)
      .reduce((acc, s) => {
        if (acc.some(item => item.interested_id === s.interested_id)) return acc;

        return [...acc, s];
      }, [] as SimulationRunSelections[])
      .map(s => ({
        interested_id: s.interested_id,
        subject_id: getSubjectId(s.interested_id),
        selected_index: s.selected_index,
        ended_at: s.ended_at,
        status: s.status,
      })),
  };
}

interface SimulationTimeData {
  simulationRunId: number;
  accuracy: number;
  subjectCount: number;
  searchBtnTime: number;
  captchaTime: number;
  subjectTime: number;
  totalTime: number;
}

export interface ISubjectsAnalysis {
  subjectId: number;
  successCount: number;
  failedCount: number;
  doubledCount: number;
  totalCount: number;
  avgCompletionTime: number;
  avgIndex: number;
}

export interface AggregatedResultResponse {
  // 기존 필드들...
  total_users: number;
  avg_started_at: number;
  avg_ended_at: number;
  avg_elapsed_time: number;
  subject_success_rate: {
    subject_id: number;
    success_count: number;
    total_count: number;
    success_rate: number;
    avg_completion_time: number;
  }[];
  status_distribution: {
    status: number;
    count: number;
    percentage: number;
  }[];

  // 추가되는 필드: 시뮬레이션별 시간 분석 데이터
  simulations: SimulationTimeData[];
  subjects: ISubjectsAnalysis[];
}

/**
 * 모든 시뮬레이션 결과에 대한 종합 통계 데이터를 생성합니다.
 *
 * 이 함수는 다음과 같은 통계 정보를 계산합니다:
 * - 총 사용자 수 및 평균 시작/종료 시간
 * - 사용자 능력치 평균 (검색 버튼 속도, 총 속도, 정확도, 캡차 속도)
 * - 과목별 성공률과 평균 완료 시간
 * - 상태별 분포 (성공, 실패, 캡차 실패 등의 비율)
 *
 * @returns {Promise<AggregatedResultResponse>} 종합 통계 데이터를 포함한 객체
 * @throws {Error} 통계를 계산할 시뮬레이션 데이터가 없을 경우 오류 발생
 *
 * @example
 * // 전체 시뮬레이션 통계 가져오기
 * try {
 *   const stats = await getAggregatedSimulationResults();
 *   console.log(`총 ${stats.total_users}명의 사용자 데이터 분석 완료`);
 * } catch (error) {
 *   console.error('통계 생성 실패:', error.message);
 * }
 */
export async function getAggregatedSimulationResults(): Promise<AggregatedResultResponse> {
  // 1. 모든 완료된 시뮬레이션 가져오기
  const completedSimulations = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();
  const simulationCount = completedSimulations.length;

  if (simulationCount === 0) {
    throw new Error('통계를 계산할 시뮬레이션 데이터가 없습니다.');
  }

  // 2. 모든 selections 데이터 가져오기
  const allSelections = await db.simulation_run_selections.toArray();

  // 3. 시뮬레이션 데이터 정리
  const simulationData = await Promise.all(
    completedSimulations.map(async sim => {
      const selections = await db.simulation_run_selections
        .filter(sel => sel.simulation_run_id === sim.simulation_run_id)
        .toArray();

      const selectionIds = selections.map(s => s.run_selections_id);
      const captchaEvents = await db.simulation_run_events
        .filter(e => e.event_type === BUTTON_EVENT.CAPTCHA && selectionIds.includes(e.simulation_section_id))
        .toArray();

      const searchBtnTime = (sim.search_event_at - sim.started_at) * SEC;

      const captchaTime =
        captchaEvents.reduce((acc, event) => {
          const selection = selections.find(s => s.run_selections_id === event.simulation_section_id);
          if (selection) return acc + (event.timestamp - selection.started_at);
          return acc;
        }, 0) * SEC;

      const subjectTime =
        selections.reduce((acc, sel) => {
          if (sel.ended_at >= 0) return acc + (sel.ended_at - sel.started_at);
          return acc;
        }, 0) * SEC;

      return {
        simulationRunId: sim.simulation_run_id,
        accuracy: sim.accuracy,
        subjectCount: sim.subject_count,
        searchBtnTime,
        captchaTime: captchaTime + searchBtnTime,
        subjectTime: subjectTime + searchBtnTime,
        totalTime: sim.total_elapsed * SEC,
      };
    }),
  );

  // 4. 과목별 데이터 수집
  const subjectSnapshots = await db.interested_snapshot.filter(shot => shot.simulated).last();

  if (!subjectSnapshots) {
    throw new Error('과목 스냅샷 데이터가 없습니다.');
  }

  const subjects = await db.interested_subject
    .filter(sub => sub.snapshot_id === subjectSnapshots.snapshot_id)
    .toArray();

  const subjectData = subjects.map(sub => {
    const selections = allSelections.filter(sel => sel.interested_id === sub.interested_id);
    const successCount = selections.filter(sel => sel.status === APPLY_STATUS.SUCCESS).length;
    const failedCount = selections.filter(sel => sel.status === APPLY_STATUS.FAILED).length;
    const doubledCount = selections.filter(sel => sel.status === APPLY_STATUS.DOUBLED).length;
    const totalCount = selections.length;
    const avgIndex = selections.reduce((acc, sel) => acc + sel.selected_index, 0) / totalCount || 0;

    const completionTimes = selections
      .filter(sel => sel.ended_at >= 0 && sel.started_at >= 0)
      .map(sel => (sel.ended_at - sel.started_at) * SEC);

    const avgCompletionTime = average(completionTimes);

    return {
      subjectId: sub.subject_id,
      successCount,
      failedCount,
      doubledCount,
      totalCount,
      avgCompletionTime,
      avgIndex,
    };
  });

  // 4. 과목별 성공률 계산
  const subjectStats = new Map();

  for (const selection of allSelections) {
    const simulationId = selection.simulation_run_id;
    const simulation = completedSimulations.find(s => s.simulation_run_id === simulationId);
    if (!simulation) continue;

    const snapshot = await getInterestedSnapshotById(simulation.snapshot_id);
    if (!snapshot) continue;

    const subject = snapshot.subjects.find(s => s.interested_id === selection.interested_id);
    if (!subject) continue;

    const subjectId = subject.subject_id;

    if (!subjectStats.has(subjectId)) {
      subjectStats.set(subjectId, {
        subject_id: subjectId,
        success_count: 0,
        total_count: 0,
        completion_time_sum: 0,
      });
    }

    const stat = subjectStats.get(subjectId);
    stat.total_count++;

    if (selection.status === 1) {
      // SUCCESS 상태
      stat.success_count++;
      stat.completion_time_sum += selection.ended_at - selection.started_at;
    }
  }

  const subjectSuccessRates = Array.from(subjectStats.values()).map(stat => ({
    subject_id: stat.subject_id,
    success_count: stat.success_count,
    total_count: stat.total_count,
    success_rate: stat.success_count / stat.total_count,
    avg_completion_time: stat.success_count > 0 ? stat.completion_time_sum / stat.success_count / 1000 : 0,
  }));

  // 5. 상태별 분포 계산
  const statusCounts = allSelections.reduce<Record<number, number>>((acc, selection) => {
    acc[selection.status] = (acc[selection.status] || 0) + 1;
    return acc;
  }, {});

  const totalSelections = allSelections.length;
  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status: Number(status),
    count: count as number,
    percentage: (count as number) / totalSelections,
  }));

  // 6. 캡차 평균 속도 계산
  const simulationIds = completedSimulations.map(s => s.simulation_run_id);
  const selectionIds = allSelections
    .filter(s => simulationIds.includes(s.simulation_run_id))
    .map(s => s.run_selections_id);

  const captchaEvents = await db.simulation_run_events
    .filter(e => selectionIds.includes(e.simulation_section_id) && e.event_type === BUTTON_EVENT.CAPTCHA)
    .toArray();

  let captchaSpeedSum = 0;
  let captchaCount = 0;

  for (const event of captchaEvents) {
    const selection = allSelections.find(s => s.run_selections_id === event.simulation_section_id);
    if (selection) {
      captchaSpeedSum += event.timestamp - selection.started_at;
      captchaCount++;
    }
  }

  // 7. 결과 반환
  return {
    total_users: simulationCount,
    avg_started_at: completedSimulations.reduce((acc, sim) => acc + sim.started_at, 0) / simulationCount,
    avg_ended_at: completedSimulations.reduce((acc, sim) => acc + sim.ended_at, 0) / simulationCount,
    avg_elapsed_time:
      completedSimulations.reduce((acc, sim) => acc + (sim.ended_at - sim.started_at), 0) / simulationCount / 1000,

    subject_success_rate: subjectSuccessRates,
    status_distribution: statusDistribution,

    simulations: simulationData,
    subjects: subjectData,
  };
}

function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}
