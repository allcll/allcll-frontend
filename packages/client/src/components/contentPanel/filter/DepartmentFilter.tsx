import useDepartments from '@/hooks/server/useDepartments';
import Filtering from './Filtering';
import SearchBox from '../../common/SearchBox';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { DepartmentType } from '@/utils/types';
import { useEffect, useMemo, useState } from 'react';
import { disassemble } from 'es-hangul';

function DepartmentFilter() {
  const { data: departments } = useDepartments();
  const [searchKeywords, setSearchKeywords] = useState('');
  const [category, setCategory] = useState<'전체' | '전공' | '교양'>('전체');

  const departmentsList = useMemo(
    () => [{ departmentName: '전체학과', departmentCode: '' }, ...(departments ?? [])],
    [departments],
  );

  function pickCollegeOrMajor(selectedDepartment: string) {
    const department = departmentsList.find(department => department.departmentCode === selectedDepartment);

    if (!department) {
      return '학과가 없습니다.';
    }

    const splitDepartment = department.departmentName.split(' ');
    return splitDepartment[splitDepartment.length - 1];
  }

  const [filterDepartment, setFilterDepartment] = useState(departmentsList);
  const { selectedDepartment, setFilterSchedule } = useFilterScheduleStore();
  const customDepartmentLabel = selectedDepartment === '' ? '전체학과' : pickCollegeOrMajor(selectedDepartment);

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
    <>
      <Filtering
        label={customDepartmentLabel}
        className="max-h-120 overflow-y-auto"
        selected={selectedDepartment.length !== 0}
      >
        <div className="flex flex-col h-80">
          <div className="shrink-0 gap-2 flex px-2 py-2 bg-white">
            <select
              value={category}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white"
              onChange={e => {
                const value = e.target.value as '전체' | '전공' | '교양';
                setCategory(value);
                setFilterSchedule('selectedDepartment', '');
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

          <div className="overflow-y-auto flex-1 px-2 py-2">
            {(category === '전공' || category === '교양') && <SelectSubject departments={filterDepartment} />}{' '}
          </div>
        </div>
      </Filtering>
    </>
  );
}

export default DepartmentFilter;

interface ISelectSubject {
  departments: DepartmentType[];
}

export function SelectSubject({ departments }: ISelectSubject) {
  const selected = '전체학과';
  const { setFilterSchedule } = useFilterScheduleStore();

  const handleChangeDepartment = (department: string) => {
    setFilterSchedule('selectedDepartment', department || '');
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
