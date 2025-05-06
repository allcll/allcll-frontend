import {useEffect, useState} from 'react';
import {useIndexedDB} from 'react-indexed-db-hook';
import {IndexDBMutation, IndexDBQuery} from '@/hooks/simulation/useSimulationData.ts';
import {
  InterestedSnapshot,
  InterestedSnapshotData,
  InterestedSubject,
  InterestedSubjectData
} from '@/utils/dbConfig.ts';

/**
 * 최근 관심과목 스냅샷을 불러옵니다.
 * @Todo: error 처리
 * @returns 스냅샷 데이터와 로딩 함수를 제공합니다.
 */
export function useRecentSnapshot() :IndexDBQuery<InterestedSnapshot> {
    const { getAll } = useIndexedDB('interested_snapshot');
    const [snapshot, setSnapshot] = useState<InterestedSnapshot|null>(null);
    const isPending = snapshot === null;
    const isError = snapshot === null && !isPending;

    const getMostRecentSnapshot = async () => {
      const snapshots = await getAll<InterestedSnapshot>();
      if (!snapshots.length) return null;
      return snapshots.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
    };

    useEffect(() => {
      getMostRecentSnapshot().then((data) => {
        setSnapshot(data);
      });
    }, [])

    return { data: snapshot, isPending, isError };
}

/**
 * 새로운 스냅샷을 생성합니다.
 * 시뮬레이션 되지 않은 스냅샷이 있다면, 그 스냅샷을 덮어씁니다.
 * @returns 스냅샷 생성 함수를 제공합니다.
 */
export function useSnapshotCreate(subjectIds: number[]) :IndexDBMutation<InterestedSnapshot> {
  const { getAll, add } = useIndexedDB('interested_snapshot');
  const { add:addSubject, deleteRecord, getAll: getAllSubjects } = useIndexedDB('interested_subject');
  const [isSuccess, setIsSuccess] = useState(false);

  const createSnapshot = async () => {
    // 최근 스냅샷 가져오기
    const snapshots = await getAll<InterestedSnapshot>();
    const recent = !snapshots.length ? null : snapshots.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    // 기존 스냅샷 관심과목 삭제
    if (recent && !recent.simulated) {
      const subjects = await getAllSubjects<InterestedSubject>();
      const targets = subjects.filter((subject) => subject.snapshot_id === recent.snapshot_id);

      await Promise.all(
        targets.map((subject: InterestedSubject) => {
          return deleteRecord(subject.interested_id);
        })
      );
    }

    // 새로운 스냅샷 생성
    const snapshotId = recent && !recent.simulated ?
      recent.snapshot_id :
      await add<InterestedSnapshotData>({user_id: 'Todo: user_id', created_at: new Date().toISOString(), simulated: false});

    // 관심과목 추가
    await Promise.all(
      subjectIds.map((subjectId: number) => {
        return addSubject<InterestedSubjectData>({
          snapshot_id: snapshotId,
          subject_id: subjectId,
        });
      })
    );

    setIsSuccess(true);

    // Event 처리 (onSuccess)
  };

  return { mutate: () => createSnapshot().then(), isLoading: !isSuccess, isError: false, isSuccess};
}

/**
 * 관심과목 리스트를 불러옵니다.
 * @returns 관심과목 목록과 로딩 함수를 제공합니다.
 */
export function useInterestedSubjectList():IndexDBQuery<InterestedSubject[]> {
  // 최근 스냅샷 id를 가져오고, 그에 해당하는 관심과목을 가져옵니다.
  const { getAll: getSnapshot } = useIndexedDB('interested_snapshot');
  const { getAll } = useIndexedDB('interested_subject');

  const [subjects, setSubjects] = useState<InterestedSubject[]|null>(null);
  const isPending = subjects === null;
  const isError = subjects === null && !isPending;

  const getFavoriteList = async () => {
    // 최근 스냅샷 가져오기
    const snapshots = await getSnapshot<InterestedSnapshot>();
    if (!snapshots.length) return [];
    const recent = snapshots.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    // 최근 스냅샷에 해당하는 관심과목만 필터링
    const subjects = await getAll<InterestedSubject>();
    if (!subjects.length) return [];

    return subjects.filter((subject) => subject.snapshot_id === recent.snapshot_id);
  };

  useEffect(() => {
    getFavoriteList().then((data) => {
      setSubjects(data);
    });
  }, []);

  return { data: subjects, isPending, isError };
}

/**
 * 관심과목을 생성합니다.
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
 * @param subjectId 삭제할 과목 ID입니다.
 * @returns 삭제 함수를 제공합니다.
 */
// export function useDeleteFavorite() {
//   const deleteFavorite = async (subjectId: string) => {
//     // API 요청 등을 통해 관심과목을 삭제
//   };
//   return { deleteFavorite };
// }
