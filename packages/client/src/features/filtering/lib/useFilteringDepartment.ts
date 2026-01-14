import { disassemble } from 'es-hangul';
import { useMemo } from 'react';

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

        const cleanInput = searchKeywords.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledInput = disassemble(cleanInput).toLowerCase();

        const cleanName = department.departmentName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledName = disassemble(cleanName).toLowerCase();

        return disassembledName.includes(disassembledInput);
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
