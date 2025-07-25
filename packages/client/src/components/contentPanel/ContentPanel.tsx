import { useEffect, useState } from 'react';
import SearchBox from '../common/SearchBox';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import { disassemble } from 'es-hangul';
import { Subject } from '@/utils/types';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import useScheduleModal from '@/hooks/useScheduleModal';
import { Schedule } from '@/hooks/server/useTimetableData';

const initSchedule: Schedule = {
  scheduleId: -1,
  scheduleType: 'custom',
  subjectId: null,
  subjectName: '',
  professorName: '',
  location: '',
  timeslots: [],
};

function ContentPanel() {
  const subjects: Subject[] = [];
  const isPending = false;
  const { selectedDepartment, selectedGrades, selectedDays } = useFilterScheduleStore();
  const [searchKeywords, setSearchKeywords] = useState('');
  const [filteredData, setFilteredData] = useState<Subject[]>(subjects ?? []);

  const { openScheduleModal } = useScheduleModal();

  const handleCreateSchedule = () => {
    openScheduleModal(initSchedule);
  };

  useEffect(() => {
    if (!subjects) {
      setFilteredData([]);
      return;
    }

    const result = subjects.filter(subject => {
      const filteringDays = (lesn_time: string): boolean => {
        if (selectedDays.length === 0) return true;
        const days: string[] = lesn_time.match(/[가-힣]{1}(?=\d)/g) || [];

        if (!days) return false;
        return selectedDays.some(d => days.includes(d));
      };

      const filteringGrades = (subject: Subject): boolean => {
        if (selectedGrades.length === 0) return true;
        const sem = subject.studentYear;
        if (selectedGrades.includes('전체')) return true;
        if (selectedGrades.includes(1) && sem === '1') return true;
        if (selectedGrades.includes(2) && sem === '2') return true;
        if (selectedGrades.includes(3) && sem === '3') return true;
        if (selectedGrades.includes(4) && sem === '4') return true;
        return false;
      };

      const filteringSearchKeywords = (subject: Subject): boolean => {
        if (!searchKeywords) return true;

        const clearnSearchInput = searchKeywords?.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledSearchInput = disassemble(clearnSearchInput).toLowerCase();

        const disassembledProfessorName = subject.professorName ? disassemble(subject.professorName).toLowerCase() : '';
        const cleanSubjectName = subject.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

        const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
        const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);
        return matchesProfessor || matchesSubject;
      };

      return filteringGrades(subject) && filteringDays(subject.lesnTime) && filteringSearchKeywords(subject);
    });

    setFilteredData(result);
  }, [subjects, selectedDepartment, selectedGrades, selectedDays, searchKeywords]);

  return (
    <div className="w-full h-screen md:basis-1/3 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox
        type="text"
        value={searchKeywords}
        placeholder="과목명 검색"
        onDelete={() => setSearchKeywords('')}
        onChange={e => setSearchKeywords(e.target.value)}
      />
      <div className="flex flex-wrap gap-3 w-full">
        <DepartmentFilter />
        <GradeFilter />
        <DayFilter />
      </div>
      <button type="button" className="text-blue-500 cursor-pointer text-sm" onClick={handleCreateSchedule}>
        + 직접추가
      </button>
      <div className="overflow-y-auto max-h-[80vh]">
        <FilteredSubjectCards subjects={filteredData} isPending={isPending} />
      </div>
    </div>
  );
}

export default ContentPanel;
