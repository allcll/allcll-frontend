import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import SearchBox from '../common/SearchBox';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import { disassemble } from 'es-hangul';
import useSubject from '@/hooks/server/useSubject';
import { Subject } from '@/utils/types';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import useDetectClose from '@/hooks/useDetectClose';

interface IContentPanel {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

function ContentPanel({ setIsModalOpen }: IContentPanel) {
  const { data: subjects = [], isPending } = useSubject();
  const { selectedDepartment, selectedGrades, selectedDays } = useFilterScheduleStore();

  const [openFilter, setOpenFilter] = useState({
    학과: false,
    학년: false,
    요일: false,
  });
  const [searchKeywords, setSearchKeywords] = useState('');
  const [filteredData, setFilteredData] = useState<Subject[]>([]);

  const toggleFilter = (key: '학과' | '학년' | '요일') => {
    setOpenFilter(prev => {
      const isCurrentlyOpen = prev[key];

      return {
        학과: false,
        학년: false,
        요일: false,
        [key]: !isCurrentlyOpen,
      };
    });
  };

  useEffect(() => {
    const result = subjects.filter(subject => {
      const filteringDays = (lesn_time: string): boolean => {
        if (selectedDays.length === 0) return true;
        const match = lesn_time.match(/^([가-힣]+)(\d{1,2}):\d{2}-(\d{1,2}):\d{2}$/);
        if (!match) return false;
        const [_, dayStr] = match;
        const days = dayStr.split('');
        return selectedDays.some(d => days.includes(d));
      };

      const filteringGrades = (subject: Subject): boolean => {
        if (selectedGrades.length === 0) return true;
        const sem = subject.semester_at;
        if (selectedGrades.includes(1) && [1, 2].includes(sem)) return true;
        if (selectedGrades.includes(2) && [3, 4].includes(sem)) return true;
        if (selectedGrades.includes(3) && [5, 6].includes(sem)) return true;
        if (selectedGrades.includes(4) && [7, 8].includes(sem)) return true;
        return false;
      };

      return filteringGrades(subject) && filteringDays(subject.lesn_time);
    });

    setFilteredData(result);
  }, [selectedDepartment, selectedGrades, selectedDays]);

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
  }, [searchKeywords]);

  return (
    <div className="w-full h-screen md:basis-1/3 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox
        type="text"
        value={searchKeywords}
        placeholder="과목명 검색"
        onDelete={() => setSearchKeywords('')}
        onChange={e => setSearchKeywords(e.target.value)}
      />

      <div className="flex flex-row gap-3">
        <DepartmentFilter openFilter={openFilter.학과} onToggle={() => toggleFilter('학과')} />
        <GradeFilter openFilter={openFilter.학년} onToggle={() => toggleFilter('학년')} />
        <DayFilter openFilter={openFilter.요일} onToggle={() => toggleFilter('요일')} />
        <button type="button" className="text-blue-500 cursor-pointer text-sm" onClick={() => setIsModalOpen(true)}>
          + 직접추가
        </button>
      </div>

      <div className="overflow-y-auto max-h-[80vh]">
        <FilteredSubjectCards subjects={filteredData} isPending={isPending} />
      </div>
    </div>
  );
}

export default ContentPanel;
