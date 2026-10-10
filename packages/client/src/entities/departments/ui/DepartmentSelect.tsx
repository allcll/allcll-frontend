import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { matchOptionKeyword } from '@/shared/lib/search.ts';
import { SearchableSelect, Label } from '@allcll/allcll-ui';

interface IDepartmentSelect {
  id?: string;
  className?: string;
  value?: string;
  onChange: (departmentCode: string) => void;
  defaultValue?: string;
}

function DepartmentSelect({ id, className = '', value = '', onChange, defaultValue = '전체' }: IDepartmentSelect) {
  const { data: departments } = useDepartments();
  const options = [
    { value: '', label: defaultValue },
    ...(departments ?? []).map(({ departmentCode, departmentName }) => ({
      value: departmentCode,
      label: departmentName,
    })),
  ];

  const customId = id ?? 'department-filter';

  return (
    <>
      <Label htmlFor={customId} hidden>
        학과
      </Label>
      <SearchableSelect
        id={customId}
        className={className || 'w-full'}
        options={options}
        value={value}
        onChange={onChange}
        searchPlaceholder="학과 검색"
        filterOption={matchOptionKeyword}
      />
    </>
  );
}

export default DepartmentSelect;
