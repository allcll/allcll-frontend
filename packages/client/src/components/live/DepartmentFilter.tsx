import useDepartments from '@/hooks/server/useDepartments.ts';
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
      <label htmlFor={customId} className="hidden">
        학과
      </label>
      <select
        id={customId}
        className={'pl-2 pr-4 py-2 rounded-md bg-white border border-gray-400 ' + className}
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
