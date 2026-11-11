import { useMemo } from 'react';
import { getNormalizedKeyword } from '@/shared/lib/search.ts';

import { DepartmentType } from '@/features/filtering/model/types.ts';

export type DepartmentCategory = '전체' | '전공' | '교양';

export const ALL_DEPARTMENT: DepartmentType = { departmentName: '전체 학과', departmentCode: '' };

interface useFilteringDepartmentProps {
  category: DepartmentCategory;
  setCategory: (category: DepartmentCategory) => void;
  searchKeywords: string;
  setSearchKeywords: (keywords: string) => void;
  departments: DepartmentType[];
}

export function useFilteringDepartment({
  departments,
  category,
  setCategory,
  searchKeywords,
  setSearchKeywords,
}: Partial<useFilteringDepartmentProps> = {}) {
  const departmentsList = useMemo<DepartmentType[]>(() => {
    // 학과명 끝 단어 기준으로 정렬 (ex: 컴퓨터공학과, 소프트웨어학과)
    const sorted = [...(departments ?? [])].sort((a, b) => {
      const aLast = a.departmentName.split(' ').slice(-1)[0];
      const bLast = b.departmentName.split(' ').slice(-1)[0];

      return aLast.localeCompare(bLast);
    });

    return [ALL_DEPARTMENT, ...sorted];
  }, [departments]);

  const filteredDepartments = useMemo(() => {
    return departmentsList
      .filter(department => {
        if (department === ALL_DEPARTMENT) return true;
        if (category === '교양') return department.departmentCode === '9005';
        if (category === '전공') return department.departmentCode !== '9005';
        return true;
      })
      .filter(department => {
        if (!searchKeywords) return true;

        return getNormalizedKeyword(department.departmentName).includes(getNormalizedKeyword(searchKeywords));
      });
  }, [departmentsList, category, searchKeywords]);

  return {
    category,
    setCategory,
    searchKeywords,
    setSearchKeywords,
    departmentsList,
    filteredDepartments,
  };
}
