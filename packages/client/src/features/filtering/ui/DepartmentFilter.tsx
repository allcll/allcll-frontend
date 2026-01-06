import { useState } from 'react';
import useDepartments from '@/entities/departments/api/useDepartments.ts';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { DepartmentType } from '@/shared/model/types.ts';
import Filtering from '@/features/filtering/ui/Filtering';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import { Button, Flex, Label, ListboxOption } from '@allcll/allcll-ui';
import ResetSvg from '@/assets/reset-blue.svg?react';
import { useFilteringDepartment } from '../lib/useFilteringDepartment';
import CheckSvg from '@/assets/checkbox-blue.svg?react';
import { ZeroContent } from '@/shared/ui/ZeroContent';

interface IDepartmentFilter {
  setFilter: (key: keyof Filters, value: string | null) => void;
  selectedValue: string;
}

function DepartmentFilter({ setFilter, selectedValue }: IDepartmentFilter) {
  const { data: departments } = useDepartments();
  const [searchKeywords, setSearchKeywords] = useState('');
  const [category, setCategory] = useState<'전체' | '전공' | '교양'>('전공');

  const { departmentsList, filteredDepartments } = useFilteringDepartment({
    category,
    setCategory,
    searchKeywords,
    setSearchKeywords,
    departments,
  });

  return (
    <Filtering label={pickCollegeOrMajor(selectedValue, departmentsList)} selected={!!selectedValue}>
      <Flex direction="flex-col" className="h-80 max-h-80 w-[300px] overflow-y-auto">
        <Label>학과</Label>
        <Flex className="shrink-0 pt-2 bg-white" gap="gap-2">
          <select
            value={category}
            className="border border-gray-300 rounded-md py-1 text-sm text-gray-700 bg-white"
            onChange={e => {
              const value = e.target.value as '전체' | '전공' | '교양';
              setCategory(value);
              setFilter('department', '');
            }}
          >
            <option value="전공">전공</option>
            <option value="교양">교양</option>
          </select>
          <SearchBox
            type="text"
            placeholder="학과 검색"
            onDelete={() => {
              setSearchKeywords('');
            }}
            value={searchKeywords}
            onChange={e => {
              setSearchKeywords(e.target.value);
            }}
            className="w-full"
          />
        </Flex>

        <div className="overflow-y-auto flex-1 py-2 ">
          {(category === '전공' || category === '교양') && (
            <SelectSubject departments={filteredDepartments} setFilter={setFilter} selectedValue={selectedValue} />
          )}
        </div>
      </Flex>

      <Flex justify="justify-end" className="w-full pt-1">
        <Button variant="text" size="small" textColor="gray" onClick={() => setFilter('department', '')}>
          <ResetSvg className="inline w-3 h-3 mr-1" stroke="currentColor" />
          초기화
        </Button>
      </Flex>
    </Filtering>
  );
}

export default DepartmentFilter;

interface ISelectSubject {
  departments: DepartmentType[];
  setFilter: (key: keyof Filters, value: string | null) => void;
  selectedValue: string;
}

function SelectSubject({ departments, setFilter, selectedValue }: ISelectSubject) {
  const handleChangeDepartment = (department: string) => {
    setFilter('department', department || '');
  };

  if (!departments) {
    return <ZeroContent title="학과 리스트들이 없습니다." />;
  }

  const filteredDepartments = departments.filter(
    department => pickCollegeOrMajor(selectedValue, departments) === department.departmentName,
  );

  if (filteredDepartments.length === 0) {
    return <ZeroContent title="검색 결과가 없습니다." description="다른 학과 이름으로 검색해주세요." />;
  }

  return (
    <>
      {departments.map(department => {
        const isSelected = pickCollegeOrMajor(selectedValue, departments) === department.departmentName;

        return (
          <ListboxOption
            key={department.departmentCode}
            selected={isSelected}
            left={department.departmentName.split(' ').slice(-1)[0]}
            right={isSelected ? <CheckSvg className="w-4 h-4 shrink-0" /> : null}
            onSelect={() => handleChangeDepartment(department.departmentCode)}
          />
        );
      })}
    </>
  );
}

function pickCollegeOrMajor(selectedDepartment: string, departmentsList: DepartmentType[]) {
  const selectedDepartmentName = departmentsList?.find(
    department => department.departmentCode === selectedDepartment,
  )?.departmentName;

  if (!selectedDepartmentName) {
    return '학과가 없습니다.';
  }

  return selectedDepartmentName;
}
