import useDepartments from '@/hooks/server/useDepartments';
import Filtering from './Filtering';
import SearchBox from '../../common/SearchBox';
import { DepartmentType } from '@/utils/types';

interface IDepartmentFilter {
  openFilter: '학과' | '학년' | '요일' | null;
  toggleFilter: () => void;
  selectedDepartment: DepartmentType | '전체';
  setSelectedDepartment: React.Dispatch<React.SetStateAction<DepartmentType | '전체'>>;
}

function DepartmentFilter({ openFilter, toggleFilter, selectedDepartment, setSelectedDepartment }: IDepartmentFilter) {
  function pickCollegeOrMajor(selectedDepartment: string) {
    const splitDepartment = selectedDepartment.split(' ');
    return splitDepartment[splitDepartment.length - 1];
  }

  const customDepartmentLabel =
    selectedDepartment === '전체' ? '전체' : pickCollegeOrMajor(selectedDepartment.departmentName);

  return (
    <>
      <Filtering
        label={customDepartmentLabel}
        isOpen={openFilter === '학과'}
        onToggle={toggleFilter}
        className="max-h-80 overflow-y-auto"
      >
        <SelectSubject toggleFilter={toggleFilter} setSelectedDepartment={setSelectedDepartment} />
      </Filtering>
    </>
  );
}

export default DepartmentFilter;

interface ISelectSubject {
  toggleFilter: () => void;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<DepartmentType | '전체'>>;
}

function SelectSubject({ toggleFilter, setSelectedDepartment }: ISelectSubject) {
  const { data: departments } = useDepartments();
  const selected = '전체';

  const handleChangeDepartment = (department: DepartmentType | '전체') => {
    setSelectedDepartment(department);
    toggleFilter();
  };

  return (
    <>
      <SearchBox placeholder="학과 검색" onDelete={() => {}} />
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
          onClick={() => handleChangeDepartment(department)}
        >
          {department.departmentName}
        </div>
      ))}
    </>
  );
}
