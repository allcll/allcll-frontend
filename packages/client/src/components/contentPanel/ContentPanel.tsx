import { useEffect, useState } from 'react';
import SearchBox from '../common/SearchBox';
import { FilteredSubjectCards } from './subject/FilteredSubjectCard';
import useWishes from '@/hooks/server/useWishes';
import { Day, DepartmentType, Grade, Wishes } from '@/utils/types';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import { disassemble } from 'es-hangul';

type FilterType = '학과' | '학년' | '요일' | null;

function ContentPanel() {
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | '전체'>('전체');

  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);

  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const { data: subjects, isPending } = useWishes();

  const toggleFilter = (label: FilterType) => {
    setOpenFilter(prev => (prev === label ? null : label));
  };

  useEffect(() => {
    if (!setSearchKeywords) return;

    const handler = setTimeout(() => {
      setSearchKeywords(searchKeywords);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeywords, setSearchKeywords]);

  useEffect(() => {
    const clearnSearchInput = searchKeywords?.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const disassembledSearchInput = disassemble(clearnSearchInput).toLowerCase();

    const filtered = (subjects ?? []).filter(subject => {
      const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
      const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
      const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

      const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
      const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);
      return matchesProfessor || matchesSubject;
    });

    setFilteredData(filtered);
  }, [subjects, searchKeywords]);

  return (
    <div className="w-full  h-screen md:basis-1/3 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox
        type="text"
        placeholder="과목명 검색"
        onDelete={() => setSearchKeywords('')}
        onChange={e => setSearchKeywords(e.target.value)}
      />

      <div className="flex flex-row gap-3">
        <DepartmentFilter
          openFilter={openFilter}
          toggleFilter={() => toggleFilter('학과')}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />

        <GradeFilter
          openFilter={openFilter}
          toggleFilter={() => toggleFilter('학년')}
          selectedGrades={selectedGrades}
          setSelectedGrades={setSelectedGrades}
        />

        <DayFilter
          openFilter={openFilter}
          toggleFilter={() => toggleFilter('요일')}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />
      </div>

      <div className="overflow-y-auto max-h-[80vh]">
        <FilteredSubjectCards
          subjects={filteredData}
          isPending={isPending}
          selectedDepartment={selectedDepartment}
          selectedGrades={selectedGrades}
          selectedDays={selectedDays}
        />
      </div>
    </div>
  );
}

export default ContentPanel;
