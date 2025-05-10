import { db } from '@/utils/dbConfig.ts';

export async function getSimulationList() {
  const snapshots = await db.simulation_run.filter(run => run.ended_at !== -1).toArray();

  return {
    snapshots,
  };
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
export const getSimulationResultForUser = async (userId: string) => {
  const snapshots = await db.interested_snapshot.where('user_id').equals(userId).reverse().toArray();

  if (!snapshots.length) return null;

  const latestSnapshot = snapshots[0];
  const simulationRuns = await db.simulation_run
    .where({ snapshot_id: latestSnapshot.snapshot_id })
    .reverse()
    .sortBy('started_at');

  const latestRun = simulationRuns.at(-1);
  if (!latestRun) return null;

  const selections = await db.simulation_run_selections
    .where('simulation_run_id')
    .equals(latestRun.simulation_run_id)
    .toArray();

  // const events = await db.simulation_run_events
  //   .filter(e => selections.some(s => s.run_selections_id === e.simulation_section_id))
  //   .toArray();

  return {
    user_ability: {
      click_speed: selections.length
        ? selections.reduce((sum, s) => sum + (s.started_at ?? 0), 0) / selections.length
        : 0,
      total_elapsed: latestRun.total_elapsed,
      accuracy: latestRun.accuracy,
      score: latestRun.score,
    },

    timeline: selections.map(s => ({
      interested_id: s.interested_id,
      started_at: s.started_at,
      ended_at: s.ended_at,
      status: s.status,
    })),

    subject_results: await Promise.all(
      selections.map(async s => {
        const interested = await db.interested_subject.get(s.interested_id);
        return {
          interested_id: s.interested_id,
          subject_id: interested?.subject_id,
          started_at: s.started_at,
          ended_at: s.ended_at,
          status: s.status,
        };
      }),
    ),
  };
};
