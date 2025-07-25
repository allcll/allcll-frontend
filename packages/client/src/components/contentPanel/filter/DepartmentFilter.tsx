import useDepartments from '@/hooks/server/useDepartments';
import Filtering from './Filtering';
import SearchBox from '../../common/SearchBox';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import { DepartmentType } from '@/utils/types';
import { useEffect, useMemo, useState } from 'react';
import { disassemble } from 'es-hangul';

function DepartmentFilter() {
  function pickCollegeOrMajor(selectedDepartment: string) {
    const splitDepartment = selectedDepartment.split(' ');
    return splitDepartment[splitDepartment.length - 1];
  }

  const { data: departments } = useDepartments();

  const [searchKeywords, setSearchKeywords] = useState('');

  const departmentsList = useMemo(
    () => [{ departmentName: '전체 학과', departmentCode: '' }, ...(departments ?? [])],
    [departments],
  );

  const [filterDepartment, setFilterDepartment] = useState(departmentsList);

  const { selectedDepartment } = useFilterScheduleStore();
  const customDepartmentLabel = selectedDepartment === '전체' ? '학과' : pickCollegeOrMajor(selectedDepartment);

  useEffect(() => {
    const result = departmentsList.filter(department => {
      const clearnSearchInput = searchKeywords?.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      const disassembledSearchInput = disassemble(clearnSearchInput).toLowerCase();

      const cleanDepartmentName = department.departmentName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      const disassembledDepartmentName = disassemble(cleanDepartmentName).toLowerCase();

      const matchesDeparment = disassembledDepartmentName.includes(disassembledSearchInput);
      return matchesDeparment;
    });

    setFilterDepartment(result);
  }, [departments, searchKeywords]);

  return (
    <>
      <Filtering
        label={customDepartmentLabel}
        className="max-h-80 overflow-y-auto"
        selected={selectedDepartment.length !== 0}
      >
        <div className="flex flex-col h-80">
          <div className="shrink-0 px-2 py-2 bg-white">
            <SearchBox
              type="text"
              placeholder="학과 검색"
              onDelete={() => {
                setSearchKeywords('');
              }}
              onChange={e => {
                setSearchKeywords(e.target.value);
              }}
            />
          </div>

          <div className="overflow-y-auto flex-1 px-2 py-2">
            <SelectSubject departments={filterDepartment} />
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
  const selected = '전체';
  const { setFilterSchedule } = useFilterScheduleStore();

  const handleChangeDepartment = (department: string) => {
    setFilterSchedule('selectedDepartment', department || '전체');
  };

  return (
    <>
      {departments?.map(department => (
        <div
          key={department.departmentCode}
          role="option"
          aria-selected={selected === department.departmentName}
          className={`flex items-center gap-1 px-2 py-2 rounded cursor-pointer text-xs ${
            selected === department.departmentName
              ? 'bg-blue-50 text-blue-500 font-medium'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          onClick={() => handleChangeDepartment(department.departmentName)}
        >
          {department.departmentName}
        </div>
      ))}
    </>
  );
}
