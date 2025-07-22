import { useEffect, useState } from 'react';
import SearchBox from '../common/SearchBox';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useWishes from '@/hooks/server/useWishes';
import { Wishes } from '@/utils/types';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import { disassemble } from 'es-hangul';

type FilterType = '학과' | '학년' | '요일' | null;

function ContentPanel() {
  const [openFilter, setOpenFilter] = useState<FilterType | null>(null);

  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const { data: subjects, isPending } = useWishes();

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
      {/* <AddSubjectModal /> */}
      <SearchBox
        type="text"
        placeholder="과목명 검색"
        onDelete={() => setSearchKeywords('')}
        onChange={e => setSearchKeywords(e.target.value)}
      />

      <div className="flex flex-row gap-3">
        <DepartmentFilter openFilter={openFilter} toggleFilter={() => setOpenFilter('학과')} />
        <GradeFilter openFilter={openFilter} toggleFilter={() => setOpenFilter('학년')} />
        <DayFilter openFilter={openFilter} toggleFilter={() => setOpenFilter('요일')} />
      </div>

      <div className="overflow-y-auto max-h-[80vh]">
        <FilteredSubjectCards subjects={filteredData} isPending={isPending} />
      </div>
    </div>
  );
}

export default ContentPanel;
