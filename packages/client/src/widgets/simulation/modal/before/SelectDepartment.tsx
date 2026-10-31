import React, { useEffect } from 'react';
import useDepartments, { Department } from '@/entities/departments/api/useDepartments.ts';
import DepartmentSelect from '@/entities/departments/ui/DepartmentSelect';
import { getDepartmentRanks } from '@/features/filtering/lib/useSearchRank.ts';
import { Label } from '@allcll/allcll-ui';

interface ISelectDepartment {
  department: Department;
  setDepartment: React.Dispatch<React.SetStateAction<Department>>;
}

const isInit = false;

function SelectDepartment({ department, setDepartment }: ISelectDepartment) {
  const { data: departments } = useDepartments();

  const onSelectDepartment = (departmentCode: string) => {
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
    <div className="flex flex-col gap-1.5">
      <Label>학과 선택</Label>

      <DepartmentSelect className="w-50 sm:w-120" value={department.departmentCode} onChange={onSelectDepartment} />
    </div>
  );
}

export default SelectDepartment;
