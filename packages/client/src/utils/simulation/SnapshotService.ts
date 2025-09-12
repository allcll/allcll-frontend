/**
 * 이 파일은 시뮬레이션에 사용될 '관심 과목' 데이터를 관리하는 함수들을 포함합니다.
 * 관심 과목 목록을 '스냅샷'이라는 단위로 데이터베이스에 저장하고, 조회하며, 관리합니다.
 * 시뮬레이션을 시작하기 전에 사용자가 선택한 과목들을 스냅샷으로 저장하고,
 * 시뮬레이션 진행 중에는 이 스냅샷 데이터를 참조하여 과목 정보를 가져옵니다.
 *
 * @function getRecentInterestedSnapshot - 가장 최근에 저장된 관심 과목 스냅샷을 과목 목록과 함께 불러옵니다.
 * @function getInterestedSnapshotById - 특정 ID를 가진 관심 과목 스냅샷을 불러옵니다.
 * @function saveInterestedSnapshot - 사용자가 선택한 과목 목록을 새로운 스냅샷으로 저장합니다. 아직 시뮬레이션에 사용되지 않은 스냅샷은 덮어쓰는 최적화 로직을 포함합니다.
 * @function getInterestedId - 특정 스냅샷 내에서 주어진 과목 ID에 해당하는 관심 과목의 고유 ID를 찾습니다.
 * @function getSimulateStatus - 현재 진행 중인 시뮬레이션의 상태(신청 과목, 미신청 과목 등)를 확인합니다.
 */
import { db } from '@/utils/dbConfig.ts';
import { checkOngoingSimulation } from '@/utils/simulation/simulation.ts';

/**
 * 최근의 관심과목 스냅샷과 과목을 불러옵니다.
 * */
async function getRecentInterestedSnapshot() {
  const recent = await db.interested_snapshot.orderBy('created_at').last();
  if (!recent) return null;

  return getInterestedSnapshotById(recent.snapshot_id);
}

/**
 * 관심과목 스냅샷을 불러옵니다.
 * */
async function getInterestedSnapshotById(snapshotId: number) {
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
async function saveInterestedSnapshot(subjectIds: number[]) {
  const recent = await SnapshotService.getRecent();
  const canRewrite = recent && !recent.simulated;

  const snapshotId = canRewrite
    ? recent.snapshot_id
    : await db.interested_snapshot.add({
        user_id: 'Todo: user_id',
        created_at: Date.now(),
        simulated: false,
      });

  // 기존 데이터 삭제
  if (canRewrite) {
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

/**
 * 특정 스냅샷 내에서 주어진 과목 ID에 해당하는 관심 과목의 고유 ID를 찾습니다.
 * @param snapshotId
 * @param subjectId
 */
async function getInterestedId(snapshotId: number, subjectId: number) {
  const interested = await db.interested_subject
    .where('snapshot_id')
    .equals(snapshotId)
    .filter(subject => subject.subject_id === subjectId)
    .first();

  return interested ? interested.interested_id : -1;
}

/**
 * 진행중인 시뮬레이션을 확인하고, 신청과목, 비신청과목, 과목 상태를 반환합니다.
 * 진행중인 시뮬레이션이 없다면, {simulationId: -1} 을 반환합니다.
 */
async function getSimulateStatus() {
  const result = await checkOngoingSimulation();

  if ('errMsg' in result) throw new Error(result.errMsg);

  return result;
}

const SnapshotService = {
  getRecent: getRecentInterestedSnapshot,
  getById: getInterestedSnapshotById,
  save: saveInterestedSnapshot,
  getInterestedId: getInterestedId, // 추후 제거 요망
  getSimulateStatus, // 추후 제거 요망
};

export default SnapshotService;
