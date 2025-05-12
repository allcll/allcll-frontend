import { db } from '@/utils/dbConfig.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';

/**
 * 최근의 관심과목 스냅샷과 과목을 불러옵니다.
 * */
export async function getRecentInterestedSnapshot() {
  const recent = await db.interested_snapshot.orderBy('created_at').last();
  if (!recent) return null;

  const subjects = await db.interested_subject.where('snapshot_id').equals(recent.snapshot_id).toArray();

  return {
    ...recent,
    subjects,
  };
}

/**
 * 관심과목 스냅샷을 불러옵니다.
 * */
export async function getInterestedSnapshotById(snapshotId: number) {
  const snapshot = await db.interested_snapshot.get(snapshotId);
  if (!snapshot) return null;

  const subjects = await db.interested_subject.where('snapshot_id').equals(snapshotId).toArray();

  return {
    ...snapshot,
    subjects,
  };
}

/**
 * 관심과목 스냅샷을 저장합니다
 * 스냅샷이 시뮬레이션에 사용되지 않았다면, 기존 스냅샷에 덮어씁니다.
 * */
export async function saveInterestedSnapshot(subjectIds: number[]) {
  const recent = await db.interested_snapshot.orderBy('created_at').last();

  const snapshotId =
    recent && !recent.simulated
      ? recent.snapshot_id
      : await db.interested_snapshot.add({
          user_id: 'Todo: user_id',
          created_at: Date.now(),
          simulated: false,
        });

  // 기존 데이터 삭제
  if (recent && !recent.simulated) {
    await db.interested_snapshot.update(recent.snapshot_id, { created_at: Date.now() });
    await db.interested_subject.where('snapshot_id').equals(recent.snapshot_id).delete();
  }

  await db.interested_subject.bulkAdd(
    subjectIds.map(subjectId => ({
      snapshot_id: snapshotId,
      subject_id: subjectId,
    })),
  );
}

export async function getInterestedId(snapshotId: number, subjectId: number) {
  const interested = await db.interested_subject
    .where('snapshot_id')
    .equals(snapshotId)
    .filter(subject => subject.subject_id === subjectId)
    .first();

  return interested ? interested.interested_id : -1;
}

/**
 * 진행중인 시뮬레이션을 확인하고, 신청과목, 비신청과목, 과목 상태를 반환합니다.
 * 진행중인 시뮬레이션이 없다면, null 을 반환합니다.
 */
export async function getSimulateStatus() {
  const recentSimulation = await db.simulation_run.filter(run => run.ended_at === -1).last();
  if (!recentSimulation) return null;

  const snapshot = await db.interested_snapshot.get(recentSimulation.snapshot_id);
  if (!snapshot) return null;

  // 성공 실패 과목으로 나누는 로직
  const subjectStatusArray = await db.simulation_run_selections
    .filter(
      selection =>
        selection.simulation_run_id === recentSimulation.simulation_run_id &&
        [APPLY_STATUS.FAILED, APPLY_STATUS.SUCCESS].includes(selection.status),
    )
    .toArray();
  const subjectStatus = subjectStatusArray.reduce(
    (acc, selection) => {
      if (acc.some(item => item.subjectId === selection.interested_id)) return acc;
      return [
        ...acc,
        {
          subjectId: selection.interested_id,
          status: selection.status,
        },
      ];
    },
    [] as { subjectId: number; status: APPLY_STATUS }[],
  );

  //신청 과목
  const subjects = await db.interested_subject.where('snapshot_id').equals(recentSimulation.snapshot_id).toArray();

  const registeredSubjects = subjects.reduce(
    (acc, subject) => {
      if (
        subjectStatus.some(item => item.subjectId === subject.interested_id && item.status === APPLY_STATUS.SUCCESS)
      ) {
        return [...acc, { subjectId: subject.subject_id }];
      }
      return acc;
    },
    [] as { subjectId: number }[],
  );

  // 비신청 과목
  const nonRegisteredSubjects = subjects.reduce(
    (acc, subject) => {
      /**
       * registeredSubjects -> !registeredSubjects로 변경
       */
      if (!registeredSubjects.some(item => item.subjectId === subject.interested_id)) {
        return [...acc, { subjectId: subject.subject_id }];
      }
      return acc;
    },
    [] as { subjectId: number }[],
  );

  return {
    simulationId: recentSimulation.simulation_run_id,
    nonRegisteredSubjects,
    registeredSubjects,
    subjectStatus,
  };
}
