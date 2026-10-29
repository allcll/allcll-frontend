import { useMemo } from 'react';
import { Wishes } from '@/shared/model/types.ts';

let departmentRank: Record<string, number> | undefined;

// 학과 클릭 순위를 불러오는 함수
function loadDepartmentRank() {
  if (departmentRank) return departmentRank;

  const localData = JSON.parse(localStorage.getItem('departmentRank') ?? '{}');
  departmentRank = localData as Record<string, number>;
  return departmentRank;
}

// 학과 클릭 순위를 저장하는 함수
function saveDepartmentRank() {
  if (!departmentRank) return;
  localStorage.setItem('departmentRank', JSON.stringify(departmentRank));
}

// 학과 클릭 순위를 기록하는 함수
export function loggingDepartment(departmentCode: string) {
  if (!departmentRank) departmentRank = loadDepartmentRank();

  if (departmentRank[departmentCode] === undefined) {
    departmentRank[departmentCode] = 0;
  } else {
    departmentRank[departmentCode] += 1;
  }

  saveDepartmentRank();
}

/** 학과 클릭 순위를 가져오는 함수
 * 반환 값
 * [departmentCode, selectCount] = [string, number]*/
export function getDepartmentRanks() {
  if (!departmentRank) departmentRank = loadDepartmentRank();

  return Object.entries(departmentRank).sort(([, a], [, b]) => b - a);
}

// 학과 클릭 순위를 기반으로 학수번호의 평균 totalCount를 계산하여 rank를 부여하는 함수
// rank를 부여 후 sort된 Wishes 배열을 반환합니다.
function useSearchRank<T extends Wishes>(wishes: T[] | undefined) {
  const dprtRankMap = useMemo(() => {
    const dprtRank = getDepartmentRanks();
    return new Map(dprtRank.map(([code, _], i) => [code, i]));
  }, []);

  const rankedWishes = useMemo(() => {
    if (!wishes) return;
    return setRankByAverageTotalCount(wishes);
  }, [wishes]);

  return useMemo(() => {
    if (!rankedWishes) return;

    const getDprtRank = (departmentCode: string) => {
      const rank = dprtRankMap.get(departmentCode);
      return rank === undefined ? 5 : rank;
    };

    const ranked = rankedWishes.map(wish => {
      const dprtRankValue = getDprtRank(wish.departmentCode ?? wish.deptCd);
      const searchScore = (5 - dprtRankValue) * 250 + wish.rank * 100 - Number(wish.classCode);
      return { ...wish, searchScore };
    });

    const sortedWishes = ranked.sort((a, b) => b.searchScore - a.searchScore);

    return sortedWishes.map(({ searchScore, ...rest }) => rest) as T[];
  }, [dprtRankMap, rankedWishes]);
}

// 학수번호-학과 의 평균 totalCount를 각각 계산하여 rank를 부여하는 함수
function setRankByAverageTotalCount<T extends Wishes>(subjectData: T[]) {
  // 1. 데이터를 그룹화하고 각 그룹의 totalcount 합계와 개수를 계산합니다.
  const groupedData = new Map<string, { sum: number; count: number }>();

  for (const subject of subjectData) {
    const key = `${subject.subjectCode}-${subject.departmentCode}`;
    const group = groupedData.get(key);

    if (group) {
      group.sum += subject.totalCount ?? 0;
      group.count += 1;
    } else {
      groupedData.set(key, { sum: subject.totalCount ?? 0, count: 1 });
    }
  }

  // 2. 각 그룹의 평균을 계산하고, 원본 배열에 'rank' 속성을 추가합니다.
  return subjectData.map(subject => {
    const key = `${subject.subjectCode}-${subject.departmentCode}`;
    const group = groupedData.get(key)!;
    const rank = group.sum / group.count;
    return { ...subject, rank };
  });
}

export default useSearchRank;
