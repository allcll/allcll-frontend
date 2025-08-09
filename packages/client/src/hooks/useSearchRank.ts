import { useMemo } from 'react';
import { Wishes } from '@/utils/types.ts';

let departmentRank: Record<string, number> | undefined;

function loadDepartmentRank() {
  if (departmentRank) return departmentRank;

  const localData = JSON.parse(localStorage.getItem('departmentRank') ?? '{}');
  departmentRank = localData as Record<string, number>;
  return departmentRank;
}

function saveDepartmentRank() {
  if (!departmentRank) return;
  localStorage.setItem('departmentRank', JSON.stringify(departmentRank));
}

export function loggingDepartment(departmentCode: string) {
  if (!departmentRank) departmentRank = loadDepartmentRank();

  if (departmentRank[departmentCode] === undefined) {
    departmentRank[departmentCode] = 0;
  } else {
    departmentRank[departmentCode] += 1;
  }

  saveDepartmentRank();
}

function getDepartmentRanks() {
  if (!departmentRank) departmentRank = loadDepartmentRank();

  return Object.entries(departmentRank).sort(([, a], [, b]) => b - a);
}

function useSearchRank<T extends Wishes>(wishes: T[] | undefined) {
  return useMemo(() => {
    if (!wishes) return wishes;

    // DprtRank = 검색 순위 0~4 순위
    // Department 당 평균 = Department, 학수번호 join : totalcount 평균
    // SearchScore = (5-DprtRank)*250 + Department 당 평균 * 100 - Number(분반)
    const dprtRank = getDepartmentRanks();
    const getDprtRank = (departmentCode: string) => {
      const rank = dprtRank.findIndex(([code]) => code === departmentCode);
      return rank === -1 ? 5 : rank;
    };

    const rankedWishes = setRankByAverageTotalCount(wishes);

    // 학수번호로 정렬 및 순위 부여
    const ranked = rankedWishes.map(wish => {
      const dprtRankValue = getDprtRank(wish.departmentCode);

      const searchScore = (5 - dprtRankValue) * 250 + wish.rank * 100 - Number(wish.classCode);

      return { ...wish, searchScore };
    });

    const sortedWishes = ranked.sort((a, b) => b.searchScore - a.searchScore);

    // searchScore 제외하여 원본 Wishes 형태로 반환
    return sortedWishes.map(({ searchScore, ...rest }) => rest) as T[];
  }, [wishes]);
}

function setRankByAverageTotalCount<T extends Wishes>(subjectData: T[]) {
  // 1. 데이터를 그룹화하고 각 그룹의 totalcount 합계와 개수를 계산합니다.
  const groupedData = new Map();

  subjectData.forEach(subject => {
    const key = `${subject.subjectCode}-${subject.departmentCode}`;
    if (!groupedData.has(key)) {
      groupedData.set(key, { sum: 0, count: 0 });
    }
    const group = groupedData.get(key);
    group.sum += subject.totalCount;
    group.count += 1;
  });

  // 2. 각 그룹의 평균을 계산합니다.
  const averageData = new Map();
  for (const [key, value] of groupedData.entries()) {
    averageData.set(key, value.sum / value.count);
  }

  // 3. 원본 배열에 'rank' 속성을 추가하고 평균 값을 할당합니다.
  return subjectData.map(subject => {
    const key = `${subject.subjectCode}-${subject.departmentCode}`;
    const rank = averageData.get(key);
    return { ...subject, rank };
  });
}

export default useSearchRank;
