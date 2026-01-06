import React, { useEffect } from 'react';
import useDepartments, { Department } from '@/entities/departments/api/useDepartments.ts';
import DepartmentSelect from '@/entities/departments/ui/DepartmentSelect';
import { getDepartmentRanks } from '@/features/filtering/lib/useSearchRank.ts';

interface ISelectDepartment {
  department: Department;
  setDepartment: React.Dispatch<React.SetStateAction<Department>>;
}

let isInit = false;

function SelectDepartment({ department, setDepartment }: ISelectDepartment) {
  const { data: departments } = useDepartments();

  const onSelectDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentCode = e.target.value;
    const departmentName = departments?.find(d => d.departmentCode === departmentCode)?.departmentName ?? '';

    setDepartment({ departmentName, departmentCode });
  };

  useEffect(() => {
    if (isInit || !departments) return;

    // 초기화 시 첫 번째 학과를 선택
    const ranks = getDepartmentRanks();
    const filteredRanks = ranks.filter(([code]) => code !== '9005');
    if (filteredRanks.length <= 0) return;

    const departmentCode = filteredRanks[0][0];
    const departmentName = departments.find(d => d.departmentCode === departmentCode)?.departmentName ?? '';

    setDepartment({ departmentName, departmentCode });
  }, [departments]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold text-sm sm:text-md">학과 검색</h2>

      <DepartmentSelect
        className="cursor-pointer rounded-sm px-2 py-1 w-50 sm:w-120 bg-white mb-4"
        value={department.departmentCode}
        onChange={onSelectDepartment}
      />
    </div>
  );
}

export default SelectDepartment;
