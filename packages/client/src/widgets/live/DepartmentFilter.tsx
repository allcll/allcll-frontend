import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Label } from '../../../../allcll-ui';
import React from 'react';

interface IDepartmentFilter
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  value?: string;
  defaultValue?: string;
}

function DepartmentFilter({ id, className, value, defaultValue = '전체', ...props }: IDepartmentFilter) {
  const { data: departments } = useDepartments();
  const departmentsList = [{ departmentName: defaultValue, departmentCode: '' }, ...(departments ?? [])];

  const customId = id ?? 'department-filter';

  return (
    <>
      <Label htmlFor={customId} hidden>
        학과
      </Label>
      <select
        id={customId}
        className={'w-full p-2 rounded-md bg-white border border-gray-400 ' + className}
        value={value}
        {...props}
      >
        {departmentsList.map(({ departmentName, departmentCode }) => (
          <option key={departmentCode} value={departmentCode}>
            {departmentName}
          </option>
        ))}
      </select>
    </>
  );
}

export default DepartmentFilter;
