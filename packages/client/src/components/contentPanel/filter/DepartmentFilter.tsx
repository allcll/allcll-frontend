import { disassemble } from 'es-hangul';
import { useEffect, useMemo, useState } from 'react';
import useDepartments from '@/hooks/server/useDepartments';
import { Filters } from '@/store/useFilterStore.ts';
import SearchBox from '../../common/SearchBox';
import { DepartmentType } from '@/utils/types';
import Filtering from '@common/components/filtering/Filtering';
import CustomButton from '@common/components/Button';

interface IDepartmentSelectFilter {
  department: string;
  setFilter: (key: keyof Filters, value: string | null) => void;
}

function DepartmentSelectFilter({ department, setFilter }: IDepartmentSelectFilter) {
  const { data: departments } = useDepartments();
  const [searchKeywords, setSearchKeywords] = useState('');
  const [category, setCategory] = useState<'전체' | '전공' | '교양'>('전공');

  const departmentsList = useMemo(
    () => [{ departmentName: '전체학과', departmentCode: '' }, ...(departments ?? [])],
    [departments],
  );
  const [filterDepartment, setFilterDepartment] = useState(departmentsList);

  function pickCollegeOrMajor(selectedDepartment: string) {
    const selectedDepartmentName = departmentsList.find(
      department => department.departmentCode === selectedDepartment,
    )?.departmentName;

    if (!selectedDepartmentName) {
      return '학과가 없습니다.';
    }

    return selectedDepartmentName;
  }

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
    <Filtering label={pickCollegeOrMajor(department)} selected={!!department}>
      <div className="flex flex-col h-80 max-h-80 w-[300px] overflow-y-auto">
        <div className="shrink-0 gap-2 flex py-2 bg-white">
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
          />
        </div>

        <div className="overflow-y-auto flex-1 px-2 py-2 border-t border-gray-200">
          {(category === '전공' || category === '교양') && (
            <SelectSubject departments={filterDepartment} setFilter={setFilter} />
          )}{' '}
        </div>
      </div>

      <div className="flex justify-end w-full pt-1 border-t border-gray-200">
        <CustomButton variants="primary" onClick={() => setFilter('department', '')}>
          학과 초기화
        </CustomButton>
      </div>
    </Filtering>
  );
}

export default DepartmentSelectFilter;

interface ISelectSubject {
  departments: DepartmentType[];
  setFilter: (key: keyof Filters, value: string | null) => void;
}

export function SelectSubject({ departments, setFilter }: ISelectSubject) {
  const selected = '전체학과';

  const handleChangeDepartment = (department: string) => {
    setFilter('department', department || '');
  };

  return (
    <>
      {departments?.map(department => (
        <div
          key={department.departmentCode}
          role="option"
          aria-selected={selected === department.departmentName}
          className={`flex items-center gap-1 px-2 py-2 rounded cursor-pointer text-sm ${
            selected === department.departmentName
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
