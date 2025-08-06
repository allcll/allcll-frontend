import { useState } from 'react';
import SearchBox from '../common/SearchBox';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useSubject from '@/hooks/server/useSubject';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import FilterDelete from '@/components/contentPanel/filter/FilterDelete.tsx';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';

const initSchedule = new ScheduleAdapter().toUiData();

function ContentPanel() {
  const { data: subjects = [], isPending } = useSubject();
  const [searchKeywords, setSearchKeywords] = useState('');
  const { openScheduleModal } = useScheduleModal();
  const filteredData = useFilteringSubjects(subjects, searchKeywords);

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
        <FilterDelete />
        <DepartmentFilter />
        <GradeFilter />
        <DayFilter />
      </div>
      <button
        type="button"
        className="text-blue-500 cursor-pointer text-sm"
        onClick={() => openScheduleModal(initSchedule)}
      >
        + 커스텀 일정 생성
      </button>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="overflow-y-auto flex-grow">
          <FilteredSubjectCards subjects={filteredData} isPending={isPending} />
        </div>
      </div>
    </div>
  );
}

export default ContentPanel;
