import SearchBox from '@/components/common/SearchBox';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import FilterSvg from '@/assets/filter.svg?react';
import { FilteredSubjectCards } from '../subject/FilteredSubjectCards';
import { useEffect, useState } from 'react';
import { Day, Subject } from '@/utils/types';
import { disassemble } from 'es-hangul';
import useSubject from '@/hooks/server/useSubject';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import useScheduleModal from '@/hooks/useScheduleModal';
import { BottomSheetType } from '@/store/useBottomSheetStore';

export interface Schedule {
  scheduleId: number;
  scheduleType: 'official' | 'custom';
  subjectId: number | null;
  subjectName: string;
  professorName: string;
  location: string;
  timeSlots: {
    dayOfWeeks: Day;
    startTime: string;
    endTime: string;
  }[];
}

const initSchedule: Schedule = {
  scheduleId: -1,
  scheduleType: 'custom',
  subjectId: null,
  subjectName: '',
  professorName: '',
  location: '',
  timeSlots: [],
};

interface ISearchBottomSheet {
  onClose: (bottomSheetType: BottomSheetType) => void;
}

function SearchBottomSheet({ onClose }: ISearchBottomSheet) {
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Subject[]>([]);

  const { data: subjects = [], isPending } = useSubject();
  const { selectedDepartment, selectedGrades, selectedDays } = useFilterScheduleStore();
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
      const filteringDays = (lesnTime: string): boolean => {
        if (!lesnTime) return false;
        if (selectedDays.length === 0) return true;

        const match = lesnTime.match(/^([가-힣]+)(\d{1,2}):\d{2}-(\d{1,2}):\d{2}$/);
        if (!match) return false;

        const [_, dayStr] = match;
        const days = dayStr.split('');
        return selectedDays.some(d => days.includes(d));
      };

      const filteringDepartment = (subject: Subject): boolean => {
        if (!selectedDepartment || selectedDepartment === '') return true;
        if (selectedDepartment === subject.deptCd) return true;

        return false;
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

      return (
        filteringGrades(subject) &&
        filteringDays(subject.lesnTime) &&
        filteringSearchKeywords(subject) &&
        filteringDepartment(subject)
      );
    });

    if (result.length === 0) {
      return;
    }
    setFilteredData(result);
  }, [subjects, selectedDepartment, selectedGrades, selectedDays, searchKeywords]);

  return (
    <BottomSheet>
      {({ expandToMax }) => (
        <>
          <BottomSheetHeader
            title="과목검색"
            headerType="add"
            onClose={() => onClose('edit')}
            onClick={handleCreateSchedule}
          />

          <div className="flex items-center flex gap-2 py-3">
            <SearchBox
              type="text"
              placeholder="과목명 및 교수명 검색"
              value={searchKeywords}
              onChange={e => setSearchKeywords(e.target.value)}
              onDelete={() => setSearchKeywords('')}
              className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-sm"
            />
            <button className="w-20 justify-center flex cursor-pointer" onClick={() => onClose('filter')}>
              <FilterSvg className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            <FilteredSubjectCards expandToMax={expandToMax} subjects={filteredData} isPending={isPending} />
          </div>
        </>
      )}
    </BottomSheet>
  );
}

export default SearchBottomSheet;
