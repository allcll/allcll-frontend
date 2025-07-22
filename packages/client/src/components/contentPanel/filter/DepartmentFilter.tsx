import useDepartments from '@/hooks/server/useDepartments';
import Filtering from './Filtering';
import SearchBox from '../../common/SearchBox';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';

interface IDepartmentFilter {
  openFilter: '학과' | '학년' | '요일' | null;
  toggleFilter: () => void;
}

function DepartmentFilter({ openFilter, toggleFilter }: IDepartmentFilter) {
  function pickCollegeOrMajor(selectedDepartment: string) {
    const splitDepartment = selectedDepartment.split(' ');
    return splitDepartment[splitDepartment.length - 1];
  }

  const { selectedDepartment, setFilterSchedule } = useFilterScheduleStore();

  const customDepartmentLabel = selectedDepartment === '전체' ? '전체' : pickCollegeOrMajor(selectedDepartment);

  return (
    <>
      <Filtering
        label={customDepartmentLabel}
        isOpen={openFilter === '학과'}
        onToggle={toggleFilter}
        className="max-h-80 overflow-y-auto"
      >
        <div className="flex flex-col h-80">
          <div className="shrink-0 px-2 py-2 bg-white">
            <SearchBox
              placeholder="학과 검색"
              onDelete={() => {
                setFilterSchedule('selectedDepartment', '전체');
              }}
            />
          </div>

          <div className="overflow-y-auto flex-1 px-2 py-2">
            <SelectSubject toggleFilter={toggleFilter} />
          </div>
        </div>
      </Filtering>
    </>
  );
}

export default DepartmentFilter;

interface ISelectSubject {
  toggleFilter: () => void;
}

export function SelectSubject({ toggleFilter }: ISelectSubject) {
  const { data: departments } = useDepartments();
  const selected = '전체';
  const { setFilterSchedule } = useFilterScheduleStore();

  const handleChangeDepartment = (department: string) => {
    setFilterSchedule('selectedDepartment', department || '전체');
    toggleFilter();
  };

  return (
    <>
      <div
        key="all"
        role="option"
        aria-selected={selected === '전체'}
        className={`flex items-center gap-1 px-2 py-2 rounded cursor-pointer text-sm ${
          selected === '전체' ? 'bg-blue-50 text-blue-500 font-medium' : 'hover:bg-gray-50 text-gray-700'
        }`}
        onClick={() => handleChangeDepartment('전체')}
      >
        전체
      </div>
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
          onClick={() => handleChangeDepartment(department.departmentName)}
        >
          {department.departmentName}
        </div>
      ))}
    </>
  );
}
