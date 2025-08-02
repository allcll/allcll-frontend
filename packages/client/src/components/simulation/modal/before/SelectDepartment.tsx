import useDepartments from '@/hooks/server/useDepartments';
import { DepartmentType } from '@/utils/types';

interface ISelectDepartment {
  department: DepartmentType;
  saveRandomSubjects: (departmentName: string) => void;
  setDepartment: React.Dispatch<React.SetStateAction<DepartmentType>>;
}

function SelectDepartment({ department, setDepartment, saveRandomSubjects }: ISelectDepartment) {
  const { data: departments } = useDepartments();

  const handleChangeDepartment = (departmentName: string) => {
    if (departmentName === '') {
      saveRandomSubjects(departmentName);
      return;
    }

    const selected = departments?.find(dept => dept.departmentName === departmentName);
    if (selected) {
      setDepartment({ ...department, departmentName: departmentName });
      saveRandomSubjects(departmentName);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold mb-2">학과 검색</h2>
      <select
        className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-50 sm:w-120 bg-white mb-4"
        value={
          departments?.some(dept => dept.departmentName === department.departmentName) ? department.departmentName : ''
        }
        onChange={e => handleChangeDepartment(e.target.value)}
      >
        <option value="">학과가 목록에 없어요</option>
        {departments?.map(dept => (
          <option key={dept.departmentCode} value={dept.departmentName}>
            {dept.departmentName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectDepartment;
