import { db, SimulationRunSelections } from '@/utils/dbConfig.ts';
import { getInterestedSnapshotById } from '@/utils/simulation/subjects.ts';
import { getSimulationById } from '@/utils/simulation/simulation.ts';

export async function getSimulationList() {
  const snapshots = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();

  return {
    snapshots,
  };
}

export interface ResultResponse {
  user_ability: {
    click_speed: number;
    total_elapsed: number;
    accuracy: number;
    score: number;
  };
  timeline: {
    interested_id: number;
    subject_id: number;
    started_at: number;
    ended_at: number;
    status: number;
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

  // const events = await db.simulation_run_events
  //   .filter(e => selections.some(s => s.run_selections_id === e.simulation_section_id))
  //   .toArray();

  const getSubjectId = (interestedId: number) => {
    const interested = snapshots.subjects.find(i => i.interested_id === interestedId);
    return interested ? interested.subject_id : -1;
  };

  return {
    user_ability: {
      click_speed: selections.length
        ? selections.reduce((sum, s) => sum + (s.started_at ?? 0), 0) / selections.length
        : 0,
      total_elapsed: simulation.total_elapsed,
      accuracy: simulation.accuracy,
      score: simulation.score,
    },

    timeline: selections.map(s => ({
      interested_id: s.interested_id,
      subject_id: getSubjectId(s.interested_id),
      started_at: s.started_at,
      ended_at: s.ended_at,
      status: s.status,
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
