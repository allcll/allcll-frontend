import { useMemo } from 'react';
import { getNormalizedKeyword } from '@/shared/lib/search.ts';

import { DepartmentType } from '@/features/filtering/model/types.ts';

export type DepartmentCategory = '전체' | '전공' | '교양';

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
  const departmentsList = useMemo<DepartmentType[]>(
    () => [{ departmentName: '전체학과', departmentCode: '' }, ...(departments ?? [])],
    [departments],
  );

  const filteredDepartments = useMemo(() => {
    return departmentsList
      .filter(department => {
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
