import { disassemble } from 'es-hangul';
import { useEffect, useMemo, useState } from 'react';
import useDepartments from '@/hooks/server/useDepartments';
import { Filters } from '@/store/useFilterStore.ts';
import { DepartmentType } from '@/utils/types';
import Filtering from '@common/components/filtering/Filtering';
import SearchBox from '@/shared/ui/SearchBox';
import { Button, Flex } from '@allcll/allcll-ui';
import ResetSvg from '@/assets/reset-blue.svg?react';

interface IDepartmentSelectFilter {
  setFilter: (key: keyof Filters, value: string | null) => void;
  selectedValue: string;
}

function DepartmentSelectFilter({ setFilter, selectedValue }: IDepartmentSelectFilter) {
  const { data: departments } = useDepartments();
  const [searchKeywords, setSearchKeywords] = useState('');
  const [category, setCategory] = useState<'전체' | '전공' | '교양'>('전공');

  const departmentsList = useMemo(
    () => [{ departmentName: '전체학과', departmentCode: '' }, ...(departments ?? [])],
    [departments],
  );
  const [filterDepartment, setFilterDepartment] = useState(departmentsList);

  useEffect(() => {
    const result = departmentsList
      .filter(department => {
        if (category === '교양') {
          return department.departmentCode === '9005';
        } else if (category === '전공') {
          return department.departmentCode !== '9005';
        }

        return true;
      })
      .filter(department => {
        const cleanInput = searchKeywords?.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledSearchInput = disassemble(cleanInput).toLowerCase();

        const cleanDepartmentName = department.departmentName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledDepartmentName = disassemble(cleanDepartmentName).toLowerCase();

        return disassembledDepartmentName.includes(disassembledSearchInput);
      });

    setFilterDepartment(result);
  }, [departments, searchKeywords, category]);

  return (
    <Filtering label={pickCollegeOrMajor(selectedValue, departmentsList)} selected={!!selectedValue}>
      <Flex direction="flex-col" className=" h-80 max-h-80 w-[300px] overflow-y-auto">
        <Flex className="shrink-0 px-2 pt-2 bg-white" gap="gap-2">
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

        <div className="overflow-y-auto flex-1 px-2 py-2 ">
          {(category === '전공' || category === '교양') && (
            <SelectSubject departments={filterDepartment} setFilter={setFilter} selectedValue={selectedValue} />
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

export default DepartmentSelectFilter;

interface ISelectSubject {
  departments: DepartmentType[];
  setFilter: (key: keyof Filters, value: string | null) => void;
  selectedValue: string;
}

export function SelectSubject({ departments, setFilter, selectedValue }: ISelectSubject) {
  const handleChangeDepartment = (department: string) => {
    setFilter('department', department || '');
  };

  return (
    <>
      {departments?.map(department => (
        <div
          key={department.departmentCode}
          role="option"
          aria-selected={pickCollegeOrMajor(selectedValue, departments) === department.departmentName}
          className={`flex items-center gap-1 px-2 py-2 rounded cursor-pointer text-sm ${
            pickCollegeOrMajor(selectedValue, departments) === department.departmentName
              ? 'bg-blue-50 text-blue-500 font-medium'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          onClick={() => handleChangeDepartment(department.departmentCode)}
        >
          {department.departmentName}
        </div>
      ))}
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
