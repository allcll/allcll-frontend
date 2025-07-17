import { useState } from 'react';
import Checkbox from '../common/Checkbox';
import SearchBox from '../common/SearchBox';
import { FilteredSubjectCards } from './subject/FilteredSubjectCard';
import useDepartments from '@/hooks/server/useDepartments';
import Filtering from './filter/Filtering';
import useWishes from '@/hooks/server/useWishes';

function SelectSubject() {
  const { data: departments } = useDepartments();
  const selected = '공과대학';

  return (
    <>
      <SearchBox placeholder="학과 검색" onDelete={() => {}} />
      {departments?.map(dept => (
        <div
          key={dept.departmentCode}
          role="option"
          aria-selected={selected === dept.departmentName}
          className={`flex items-center gap-1 px-2 py-2 rounded cursor-pointer text-sm ${
            selected === dept.departmentName ? 'bg-blue-50 text-blue-500 font-medium' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          {dept.departmentName}
        </div>
      ))}
    </>
  );
}

function ContentPanel() {
  const [checked, setChecked] = useState(true);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const { data: subjects, isPending } = useWishes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const toggleFilter = (label: string) => {
    setOpenFilter(prev => (prev === label ? null : label));
  };

  const GRADE = [1, 2, 3, 4];
  const DAYS = ['월', '화', '수', '목', '금'];

  return (
    <div className="w-full md:basis-1/4 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox onDelete={() => {}} placeholder="과목명 검색" />

      <div className="flex flex-row gap-3">
        <Filtering
          label="학과"
          isOpen={openFilter === '학과'}
          onToggle={toggleFilter}
          className="max-h-80 overflow-y-auto"
        >
          <SelectSubject />
        </Filtering>

        <Filtering label="학년" isOpen={openFilter === '학년'} onToggle={toggleFilter}>
          {GRADE.map(grade => (
            <Checkbox key={grade} label={`${grade}학년`} isChecked={checked} onChange={handleChange} />
          ))}
        </Filtering>

        <Filtering label="요일" isOpen={openFilter === '요일'} onToggle={toggleFilter}>
          {DAYS.map(day => (
            <Checkbox key={day} label={day} isChecked={checked} onChange={handleChange} />
          ))}
        </Filtering>
      </div>

      <div className="overflow-y-auto max-h-[80vh]">
        <FilteredSubjectCards subjects={subjects ?? []} isPending={isPending} />
      </div>
    </div>
  );
}

export default ContentPanel;
