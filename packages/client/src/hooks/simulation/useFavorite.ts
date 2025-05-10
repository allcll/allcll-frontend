import { useEffect, useState } from 'react';
import { db, InterestedSnapshot, InterestedSubject } from '@/utils/dbConfig';

/**
 * 최근 관심과목 스냅샷을 불러옵니다.
 * @deprecated
 * @Todo: error 처리
 * @returns 스냅샷 데이터와 로딩 함수를 제공합니다.
 */
export function useRecentSnapshot() {
  const [snapshot, setSnapshot] = useState<InterestedSnapshot | null>(null);
  const isPending = snapshot === null;
  const isError = snapshot === null && !isPending;

  useEffect(() => {
    db.interested_snapshot
      .orderBy('created_at')
      .last()
      .then(recent => setSnapshot(recent ?? null));
  }, []);

  return { data: snapshot, isPending, isError };
}

/**
 * 새로운 스냅샷을 생성합니다.
 * @deprecated
 * 시뮬레이션 되지 않은 스냅샷이 있다면, 그 스냅샷을 덮어씁니다.
 * @returns 스냅샷 생성 함수를 제공합니다.
 */
export function useSnapshotCreate(subjectIds: number[]) {
  const [isSuccess, setIsSuccess] = useState(false);

  const createSnapshot = async () => {
    const recent = await db.interested_snapshot.orderBy('created_at').last();
    if (recent && !recent.simulated) {
      await db.interested_subject.where('snapshot_id').equals(recent.snapshot_id).delete();
    }
    const snapshotId =
      recent && !recent.simulated
        ? recent.snapshot_id
        : await db.interested_snapshot.add({
            user_id: 'Todo: user_id',
            created_at: Date.now(),
            simulated: false,
          });
    await Promise.all(
      subjectIds.map(subjectId =>
        db.interested_subject.add({
          snapshot_id: snapshotId,
          subject_id: subjectId,
        }),
      ),
    );
    setIsSuccess(true);
  };

  return {
    mutate: () => createSnapshot().then(),
    isLoading: !isSuccess,
    isError: false,
    isSuccess,
  };
}

/**
 * 관심과목 리스트를 불러옵니다.
 * @deprecated
 * @returns 관심과목 목록과 로딩 함수를 제공합니다.
 */
export function useInterestedSubjectList() {
  const [subjects, setSubjects] = useState<InterestedSubject[] | null>(null);
  const isPending = subjects === null;
  const isError = subjects === null && !isPending;

  useEffect(() => {
    (async () => {
      const recent = await db.interested_snapshot.orderBy('created_at').last();
      if (!recent) return setSubjects([]);
      const data = await db.interested_subject.where('snapshot_id').equals(recent.snapshot_id).toArray();
      setSubjects(data);
    })();
  }, []);

  return { data: subjects, isPending, isError };
}

/**
 * 관심과목을 생성합니다.
 * @deprecated
 * @param subject 생성할 과목명입니다.
 * @returns 생성 함수를 제공합니다.
 */
// export function useCreateFavorite() {
//   const createFavorite = async (subject: string) => {
//     // API 요청 등을 통해 관심과목을 추가
//   };
//   return { createFavorite };
// }

/**
 * 관심과목을 삭제합니다.
 * @deprecated
 * @param subjectId 삭제할 과목 ID입니다.
 * @returns 삭제 함수를 제공합니다.
 */
// export function useDeleteFavorite() {
//   const deleteFavorite = async (subjectId: string) => {
//     // API 요청 등을 통해 관심과목을 삭제
//   };
//   return { deleteFavorite };
// }
