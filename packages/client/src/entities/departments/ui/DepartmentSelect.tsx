import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { matchOptionKeyword } from '@/shared/lib/search.ts';
import { Flex, SearchableSelect, Label } from '@allcll/allcll-ui';

interface IDepartmentSelect {
  id?: string;
  className?: string;
  value?: string;
  onChange: (departmentCode: string) => void;
  defaultValue?: string;
  showLabel?: boolean;
}

function DepartmentSelect({
  id,
  className = '',
  value = '',
  onChange,
  defaultValue = '전체 학과',
  showLabel = false,
}: IDepartmentSelect) {
  const { data: departments } = useDepartments();
  const options = [
    { value: '', label: defaultValue },
    ...(departments ?? []).map(({ departmentCode, departmentName }) => ({
      value: departmentCode,
      label: departmentName,
    })),
  ];

  const customId = id ?? 'department-filter';

  const select = (
    <SearchableSelect
      id={customId}
      className={className || 'w-full'}
      options={options}
      value={value}
      onChange={onChange}
      searchPlaceholder="학과 검색"
      emptyDescription="다른 학과 이름으로 검색해주세요."
      filterOption={matchOptionKeyword}
    />
  );

  if (showLabel) {
    return (
      <Flex direction="flex-col" gap="gap-2">
        <Label htmlFor={customId}>학과</Label>
        {select}
      </Flex>
    );
  }

  return (
    <>
      <Label htmlFor={customId} hidden>
        학과
      </Label>
      {select}
    </>
  );
}

export default DepartmentSelect;
