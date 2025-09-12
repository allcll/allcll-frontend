/**
 * 이 파일은 시뮬레이션 '결과'와 관련된 데이터를 조회하고 가공하는 서비스 함수들을 제공합니다.
 * 개별 시뮬레이션의 상세 결과, 전체 기록, 종합 통계 등을 생성하는 비즈니스 로직을 담당합니다.
 */
import { db, SimulationRun, SimulationRunSelections, SimulationRunEvents } from '@/utils/dbConfig';
import SnapshotService from './SnapshotService';
import { APPLY_STATUS, BUTTON_EVENT } from '@/utils/simulation/simulation';

// --- Exported Types (for compatibility) --- //

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
  simulations: SimulationTimeData[];
  subjects: ISubjectsAnalysis[];
}

// --- Private Helper Functions --- //

const SEC = 1 / 1000;

async function _getRun(simulationId: number): Promise<SimulationRun | null> {
  const run = await db.simulation_run.get(simulationId);
  return run && run.ended_at !== -1 ? run : null;
}

async function _getSelections(simulationId: number): Promise<SimulationRunSelections[]> {
  return await db.simulation_run_selections.where({ simulation_run_id: simulationId }).toArray();
}

async function _getEvents(selectionIds: number[]): Promise<SimulationRunEvents[]> {
  return await db.simulation_run_events.where('simulation_section_id').anyOf(selectionIds).toArray();
}

function _average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}

// --- Public Service Methods --- //

async function getHistory() {
  const snapshots = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();
  const sortedSnapshots = snapshots.sort((a, b) => b.simulation_run_id - a.simulation_run_id);
  return { snapshots: sortedSnapshots };
}

async function getDetailedResult(simulationId: number): Promise<ResultResponse | null> {
  const run = await _getRun(simulationId);
  if (!run) return null;

  const selections = await _getSelections(run.simulation_run_id);
  if (selections.length === 0) return null;

  const snapshot = await SnapshotService.getById(run.snapshot_id);
  const events = await _getEvents(selections.map(s => s.run_selections_id));

  const getSubjectId = (interestedId: number) =>
    snapshot?.subjects.find(s => s.interested_id === interestedId)?.subject_id ?? -1;

  const captchaEvents = events.filter(e => e.event_type === BUTTON_EVENT.CAPTCHA);
  const totalCaptchaTime = captchaEvents.reduce((acc, event) => {
    const selection = selections.find(s => s.run_selections_id === event.simulation_section_id);
    return selection ? acc + (event.timestamp - selection.started_at) : acc;
  }, 0);

  return {
    started_at: run.started_at,
    ended_at: run.ended_at,
    user_ability: {
      searchBtnSpeed: (run.search_event_at - run.started_at) / 1000,
      totalSpeed: run.total_elapsed / run.subject_count / 1000,
      accuracy: run.accuracy,
      captchaSpeed: totalCaptchaTime / (captchaEvents.length || 1) / 1000,
    },
    timeline: selections.map(s => ({
      interested_id: s.interested_id,
      subject_id: getSubjectId(s.interested_id),
      started_at: s.started_at,
      ended_at: s.ended_at,
      status: s.status,
      events: events
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

async function getAggregatedStats(): Promise<AggregatedResultResponse> {
  const completedSimulations = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();
  const simulationCount = completedSimulations.length;
  if (simulationCount === 0) {
    throw new Error('통계를 계산할 시뮬레이션 데이터가 없습니다.');
  }

  const allSelections = await db.simulation_run_selections.toArray();

  const simulationData: SimulationTimeData[] = await Promise.all(
    completedSimulations.map(async sim => {
      const selections = allSelections.filter(sel => sel.simulation_run_id === sim.simulation_run_id);
      const selectionIds = selections.map(s => s.run_selections_id);
      const captchaEvents = (await _getEvents(selectionIds)).filter(e => e.event_type === BUTTON_EVENT.CAPTCHA);
      const searchBtnTime = (sim.search_event_at - sim.started_at) * SEC;
      const captchaTime =
        captchaEvents.reduce((acc, event) => {
          const selection = selections.find(s => s.run_selections_id === event.simulation_section_id);
          return selection ? acc + (event.timestamp - selection.started_at) : acc;
        }, 0) * SEC;
      const subjectTime =
        selections.reduce((acc, sel) => (sel.ended_at >= 0 ? acc + (sel.ended_at - sel.started_at) : acc), 0) * SEC;
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

  const subjectSnapshots = await db.interested_snapshot.filter(shot => shot.simulated).last();
  if (!subjectSnapshots) throw new Error('과목 스냅샷 데이터가 없습니다.');

  const subjects = await db.interested_subject.where('snapshot_id').equals(subjectSnapshots.snapshot_id).toArray();
  const subjectData: ISubjectsAnalysis[] = subjects.map(sub => {
    const selections = allSelections.filter(sel => sel.interested_id === sub.interested_id);
    const totalCount = selections.length;
    return {
      subjectId: sub.subject_id,
      successCount: selections.filter(sel => sel.status === APPLY_STATUS.SUCCESS).length,
      failedCount: selections.filter(sel => sel.status === APPLY_STATUS.FAILED).length,
      doubledCount: selections.filter(sel => sel.status === APPLY_STATUS.DOUBLED).length,
      totalCount,
      avgIndex: selections.reduce((acc, sel) => acc + sel.selected_index, 0) / totalCount || 0,
      avgCompletionTime: _average(
        selections
          .filter(sel => sel.ended_at >= 0 && sel.started_at >= 0)
          .map(sel => (sel.ended_at - sel.started_at) * SEC),
      ),
    };
  });

  const subjectStats = new Map<number, { success_count: number; total_count: number; completion_time_sum: number }>();
  for (const selection of allSelections) {
    const simulation = completedSimulations.find(s => s.simulation_run_id === selection.simulation_run_id);
    if (!simulation) continue;
    const snapshot = await SnapshotService.getById(simulation.snapshot_id);
    if (!snapshot) continue;
    const subject = snapshot.subjects.find(s => s.interested_id === selection.interested_id);
    if (!subject) continue;

    if (!subjectStats.has(subject.subject_id)) {
      subjectStats.set(subject.subject_id, { success_count: 0, total_count: 0, completion_time_sum: 0 });
    }
    const stat = subjectStats.get(subject.subject_id)!;
    stat.total_count++;
    if (selection.status === APPLY_STATUS.SUCCESS) {
      stat.success_count++;
      stat.completion_time_sum += selection.ended_at - selection.started_at;
    }
  }

  const subjectSuccessRates = Array.from(subjectStats.entries()).map(([subject_id, stat]) => ({
    subject_id,
    ...stat,
    success_rate: stat.total_count > 0 ? stat.success_count / stat.total_count : 0,
    avg_completion_time: stat.success_count > 0 ? stat.completion_time_sum / stat.success_count / 1000 : 0,
  }));

  const statusCounts = allSelections.reduce<Record<number, number>>((acc, selection) => {
    acc[selection.status] = (acc[selection.status] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status: Number(status),
    count,
    percentage: count / allSelections.length,
  }));

  return {
    total_users: simulationCount,
    avg_started_at: _average(completedSimulations.map(sim => sim.started_at)),
    avg_ended_at: _average(completedSimulations.map(sim => sim.ended_at)),
    avg_elapsed_time: _average(completedSimulations.map(sim => sim.ended_at - sim.started_at)) / 1000,
    subject_success_rate: subjectSuccessRates,
    status_distribution: statusDistribution,
    simulations: simulationData,
    subjects: subjectData,
  };
}

const ResultService = {
  getHistory,
  getDetailedResult,
  getAggregatedStats,
};

export default ResultService;
