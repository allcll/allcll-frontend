/**
 * 이 파일은 시뮬레이션 '결과'와 관련된 데이터를 조회하고 가공하는 서비스 함수들을 제공합니다.
 * 개별 시뮬레이션의 상세 결과, 전체 기록, 종합 통계 등을 생성하는 비즈니스 로직을 담당합니다.
 */
import { db, SimulationRun, SimulationRunSelections, SimulationRunEvents, InterestedSnapshot, InterestedSubject } from '@/utils/dbConfig';
import SnapshotService from './SnapshotService';
import { APPLY_STATUS, BUTTON_EVENT } from '@/utils/simulation/simulation';

// --- Exported Types --- //

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

export interface SimulationTimeData {
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

/**
 * 숫자 배열의 평균을 계산합니다.
 * @param arr - 평균을 계산할 숫자 배열
 * @returns 계산된 평균값. 배열이 비어있으면 0을 반환합니다.
 */
const _average = (arr: number[]): number => (arr.length > 0 ? arr.reduce((sum, value) => sum + value, 0) / arr.length : 0);

/**
 * ID로 특정 시뮬레이션 실행 기록을 가져옵니다. 완료된(ended_at != -1) 기록만 반환합니다.
 * @param simulationId - 가져올 시뮬레이션 실행 ID
 * @returns 시뮬레이션 실행 데이터 또는 null
 */
const _getRun = async (simulationId: number): Promise<SimulationRun | null> => {
  const run = await db.simulation_run.get(simulationId);
  return run && run.ended_at !== -1 ? run : null;
};

/**
 * 특정 시뮬레이션 실행에 속한 모든 선택 기록을 가져옵니다.
 * @param simulationId - 시뮬레이션 실행 ID
 * @returns 선택 기록 배열
 */
const _getSelectionsByRunId = (simulationId: number): Promise<SimulationRunSelections[]> =>
  db.simulation_run_selections.where({ simulation_run_id: simulationId }).toArray();

/**
 * 여러 선택 기록 ID에 해당하는 모든 이벤트 기록을 가져옵니다.
 * @param selectionIds - 이벤트 기록을 가져올 선택 ID 배열
 * @returns 이벤트 기록 배열
 */
const _getEventsBySelectionIds = (selectionIds: number[]): Promise<SimulationRunEvents[]> =>
  db.simulation_run_events.where('simulation_section_id').anyOf(selectionIds).toArray();

/**
 * 선택 및 이벤트 기록을 바탕으로 평균 캡챠 해결 시간을 계산합니다.
 * @param selections - 시뮬레이션 선택 기록 배열
 * @param events - 시뮬레이션 이벤트 기록 배열
 * @returns 평균 캡챠 해결 시간 (초 단위)
 */
const _calculateCaptchaTime = (selections: SimulationRunSelections[], events: SimulationRunEvents[]): number => {
  const captchaEvents = events.filter(e => e.event_type === BUTTON_EVENT.CAPTCHA);
  if (captchaEvents.length === 0) return 0;

  const totalCaptchaTime = captchaEvents.reduce((acc, event) => {
    const selection = selections.find(s => s.run_selections_id === event.simulation_section_id);
    return selection ? acc + (event.timestamp - selection.started_at) : acc;
  }, 0);

  return totalCaptchaTime / captchaEvents.length * SEC;
};

/**
 * 스냅샷 정보를 바탕으로 interested_id를 subject_id로 변환하는 함수를 생성합니다.
 * @param snapshot - 과목 정보가 포함된 스냅샷 데이터
 * @returns interested_id를 인자로 받아 subject_id를 반환하는 함수
 */
const _getSubjectIdResolver = (snapshot: (InterestedSnapshot & { subjects: InterestedSubject[] }) | null) => (interestedId: number): number =>
  snapshot?.subjects.find(s => s.interested_id === interestedId)?.subject_id ?? -1;

// --- `getDetailedResult` Helpers --- //

/**
 * 사용자의 시뮬레이션 수행 능력 지표를 계산합니다.
 * @param run - 시뮬레이션 실행 데이터
 * @param selections - 해당 실행에 포함된 모든 과목 선택 기록
 * @param events - 해당 실행에 포함된 모든 이벤트 기록
 * @returns 사용자의 검색 속도, 평균 처리 속도, 정확도, 캡챠 속도 지표
 */
function _calculateUserAbility(run: SimulationRun, selections: SimulationRunSelections[], events: SimulationRunEvents[]) {
  return {
    searchBtnSpeed: (run.search_event_at - run.started_at) * SEC,
    totalSpeed: run.total_elapsed / run.subject_count * SEC,
    accuracy: run.accuracy,
    captchaSpeed: _calculateCaptchaTime(selections, events),
  };
}

/**
 * 시뮬레이션 타임라인을 구성합니다.
 * @param selections - 과목 선택 기록 배열
 * @param events - 이벤트 기록 배열
 * @param getSubjectId - interested_id를 subject_id로 변환하는 함수
 * @returns 시뮬레이션 전체 과정을 시간순으로 나타내는 타임라인 데이터
 */
function _buildTimeline(selections: SimulationRunSelections[], events: SimulationRunEvents[], getSubjectId: (id: number) => number) {
  return selections.map(s => ({
    interested_id: s.interested_id,
    subject_id: getSubjectId(s.interested_id),
    started_at: s.started_at,
    ended_at: s.ended_at,
    status: s.status,
    events: events
      .filter(e => e.simulation_section_id === s.run_selections_id)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(e => ({ event: e.event_type, timestamp: e.timestamp })),
  }));
}

/**
 * 각 과목에 대한 최종 신청 결과를 정리합니다. (중복 신청 시 마지막 기록만 인정)
 * @param selections - 과목 선택 기록 배열
 * @param getSubjectId - interested_id를 subject_id로 변환하는 함수
 * @returns 과목별 최종 신청 결과 배열
 */
function _getFinalSubjectResults(selections: SimulationRunSelections[], getSubjectId: (id: number) => number) {
  return selections
    .sort((s1, s2) => s2.started_at - s1.started_at)
    .reduce((acc, s) => {
      if (!acc.some(item => item.interested_id === s.interested_id)) {
        acc.push(s);
      }
      return acc;
    }, [] as SimulationRunSelections[])
    .map(s => ({
      interested_id: s.interested_id,
      subject_id: getSubjectId(s.interested_id),
      selected_index: s.selected_index,
      ended_at: s.ended_at,
      status: s.status,
    }));
}

// --- `getAggregatedStats` Helpers --- //

/**
 * 완료된 모든 시뮬레이션의 시간 관련 데이터를 계산합니다.
 * @param completedSimulations - 완료된 시뮬레이션 실행 기록 배열
 * @param allSelections - 모든 선택 기록 배열
 * @returns 각 시뮬레이션의 시간 분석 데이터 배열
 */
async function _calculateSimulationTimeData(completedSimulations: SimulationRun[], allSelections: SimulationRunSelections[]): Promise<SimulationTimeData[]> {
    const allEvents = await _getEventsBySelectionIds(allSelections.map(s => s.run_selections_id));

    return completedSimulations.map(sim => {
        const selections = allSelections.filter(sel => sel.simulation_run_id === sim.simulation_run_id);
        const events = allEvents.filter(e => selections.some(s => s.run_selections_id === e.simulation_section_id));
        
        const searchBtnTime = (sim.search_event_at - sim.started_at) * SEC;
        const captchaTime = _calculateCaptchaTime(selections, events);
        const subjectTime = selections.reduce((acc, sel) => (sel.ended_at >= 0 ? acc + (sel.ended_at - sel.started_at) : acc), 0) * SEC;

        return {
            simulationRunId: sim.simulation_run_id,
            accuracy: sim.accuracy,
            subjectCount: sim.subject_count,
            searchBtnTime,
            captchaTime: captchaTime + searchBtnTime,
            subjectTime: subjectTime + searchBtnTime,
            totalTime: sim.total_elapsed * SEC,
        };
    });
}

/**
 * 모든 시뮬레이션 기록을 바탕으로 과목별 성공률 및 평균 완료 시간 통계를 계산합니다.
 * @param allSelections - 모든 선택 기록 배열
 * @param completedSimulations - 완료된 시뮬레이션 실행 기록 배열
 * @returns 과목별 성공률 통계 데이터 배열
 */
async function _calculateSubjectAnalytics(allSelections: SimulationRunSelections[], completedSimulations: SimulationRun[]) {
    const snapshotIds = [...new Set(completedSimulations.map(s => s.snapshot_id))];
    
    // 1. 필요한 모든 스냅샷과 과목 정보를 한번에 가져옵니다.
    const snapshots = await db.interested_snapshot.bulkGet(snapshotIds) as InterestedSnapshot[];
    const allSubjects = await db.interested_subject.where('snapshot_id').anyOf(snapshotIds).toArray();

    // 2. 과목들을 snapshot_id 기준으로 맵으로 묶습니다.
    const subjectsBySnapshotId = allSubjects.reduce((map, subject) => {
        const list = map.get(subject.snapshot_id) || [];
        list.push(subject);
        map.set(subject.snapshot_id, list);
        return map;
    }, new Map<number, InterestedSubject[]>());

    // 3. 스냅샷 원본 데이터에 과목 목록을 붙여 완전한 스냅샷 맵을 만듭니다.
    const snapshotMap = new Map(snapshots.map(s => [
        s.snapshot_id,
        { ...s, subjects: subjectsBySnapshotId.get(s.snapshot_id) || [] }
    ]));

    const subjectStatMap = new Map<number, { success_count: number; total_count: number; completion_time_sum: number }>();

    for (const selection of allSelections) {
        const simulation = completedSimulations.find(s => s.simulation_run_id === selection.simulation_run_id);
        if (!simulation) continue;

        const snapshot = snapshotMap.get(simulation.snapshot_id);
        if (!snapshot) continue;

        const subject = snapshot.subjects.find(s => s.interested_id === selection.interested_id);
        if (!subject) continue;

        const stat = subjectStatMap.get(subject.subject_id) ?? { success_count: 0, total_count: 0, completion_time_sum: 0 };
        stat.total_count++;
        if (selection.status === APPLY_STATUS.SUCCESS) {
            stat.success_count++;
            stat.completion_time_sum += selection.ended_at - selection.started_at;
        }
        subjectStatMap.set(subject.subject_id, stat);
    }

    return Array.from(subjectStatMap.entries()).map(([subject_id, stat]) => ({
        subject_id,
        ...stat,
        success_rate: stat.total_count > 0 ? stat.success_count / stat.total_count : 0,
        avg_completion_time: stat.success_count > 0 ? stat.completion_time_sum / stat.success_count * SEC : 0,
    }));
}

/**
 * 모든 신청 결과의 상태(성공, 실패 등) 분포를 계산합니다.
 * @param allSelections - 모든 선택 기록 배열
 * @returns 상태별 개수와 비율이 포함된 데이터 배열
 */
function _calculateStatusDistribution(allSelections: SimulationRunSelections[]) {
    const statusCounts = allSelections.reduce<Record<number, number>>((acc, selection) => {
        acc[selection.status] = (acc[selection.status] || 0) + 1;
        return acc;
    }, {});

    const totalSelections = allSelections.length;
    if (totalSelections === 0) return [];

    return Object.entries(statusCounts).map(([status, count]) => ({
        status: Number(status),
        count,
        percentage: count / totalSelections,
    }));
}

/**
 * 최근 스냅샷 기준으로 과목별 상세 분석 데이터를 계산합니다.
 * @param allSelections - 모든 선택 기록 배열
 * @returns 과목별 성공, 실패, 중복 횟수 및 평균 인덱스, 완료 시간 데이터 배열
 */
async function _getSubjectsAnalysis(allSelections: SimulationRunSelections[]): Promise<ISubjectsAnalysis[]> {
    const lastSnapshot = await db.interested_snapshot.filter(shot => shot.simulated).last();
    if (!lastSnapshot) return [];

    const subjects = await db.interested_subject.where('snapshot_id').equals(lastSnapshot.snapshot_id).toArray();
    return subjects.map(sub => {
        const selections = allSelections.filter(sel => sel.interested_id === sub.interested_id);
        const totalCount = selections.length;
        if (totalCount === 0) {
            return {
                subjectId: sub.subject_id,
                successCount: 0, failedCount: 0, doubledCount: 0, totalCount: 0, avgIndex: 0, avgCompletionTime: 0
            };
        }
        return {
            subjectId: sub.subject_id,
            successCount: selections.filter(sel => sel.status === APPLY_STATUS.SUCCESS).length,
            failedCount: selections.filter(sel => sel.status === APPLY_STATUS.FAILED).length,
            doubledCount: selections.filter(sel => sel.status === APPLY_STATUS.DOUBLED).length,
            totalCount,
            avgIndex: selections.reduce((acc, sel) => acc + sel.selected_index, 0) / totalCount,
            avgCompletionTime: _average(selections.filter(sel => sel.ended_at >= 0).map(sel => (sel.ended_at - sel.started_at) * SEC)),
        };
    });
}

// --- Public Service Methods --- //

/**
 * 완료된 모든 시뮬레이션 기록을 최신순으로 가져옵니다.
 * @returns 스냅샷 기록 배열
 */
async function getHistory() {
  const snapshots = await db.simulation_run.filter(run => run.ended_at !== -1).reverse().sortBy('simulation_run_id');
  return { snapshots };
}

/**
 * 특정 시뮬레이션 한 건에 대한 상세 결과 데이터를 생성합니다.
 * @param simulationId - 상세 결과를 조회할 시뮬레이션 ID
 * @returns 상세 결과 데이터 객체 또는 null
 */
async function getDetailedResult(simulationId: number): Promise<ResultResponse | null> {
  const run = await _getRun(simulationId);
  if (!run) return null;

  const selections = await _getSelectionsByRunId(run.simulation_run_id);
  if (selections.length === 0) return null;

  const snapshot = await SnapshotService.getById(run.snapshot_id);
  const events = await _getEventsBySelectionIds(selections.map(s => s.run_selections_id));
  const getSubjectId = _getSubjectIdResolver(snapshot);

  return {
    started_at: run.started_at,
    ended_at: run.ended_at,
    user_ability: _calculateUserAbility(run, selections, events),
    timeline: _buildTimeline(selections, events, getSubjectId),
    subject_results: _getFinalSubjectResults(selections, getSubjectId),
  };
}

/**
 * 완료된 모든 시뮬레이션 기록을 바탕으로 집계된 통계 데이터를 생성합니다.
 * @returns 집계된 통계 데이터 객체
 */
async function getAggregatedStats(): Promise<AggregatedResultResponse> {
  const completedSimulations = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();
  const simulationCount = completedSimulations.length;
  if (simulationCount === 0) {
    throw new Error('통계를 계산할 시뮬레이션 데이터가 없습니다.');
  }

  const allSelections = await db.simulation_run_selections.where('simulation_run_id').anyOf(completedSimulations.map(s => s.simulation_run_id)).toArray();

  const [simulations, subject_success_rate, status_distribution, subjects] = await Promise.all([
      _calculateSimulationTimeData(completedSimulations, allSelections),
      _calculateSubjectAnalytics(allSelections, completedSimulations),
      _calculateStatusDistribution(allSelections),
      _getSubjectsAnalysis(allSelections)
  ]);

  return {
    total_users: simulationCount,
    avg_started_at: _average(completedSimulations.map(sim => sim.started_at)),
    avg_ended_at: _average(completedSimulations.map(sim => sim.ended_at)),
    avg_elapsed_time: _average(completedSimulations.map(sim => sim.ended_at - sim.started_at)) * SEC,
    subject_success_rate,
    status_distribution,
    simulations,
    subjects,
  };
}

const ResultService = {
  getHistory,
  getDetailedResult,
  getAggregatedStats,
};

export default ResultService;