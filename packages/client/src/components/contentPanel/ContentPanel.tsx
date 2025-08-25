import { useDeferredValue, useState } from 'react';
import SearchBox from '../common/SearchBox';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import CreditFilter from './filter/CreditFilter';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import FilterDelete from '@/components/contentPanel/filter/FilterDelete.tsx';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import CuriTypeFilter from './filter/CuriTypeFilter';
import SeatFilter from './filter/SeatFilter';
import WishFilter from './filter/WishFilter';

const initSchedule = new ScheduleAdapter().toUiData();

function ContentPanel() {
  const { data, isPending } = useWishes();
  const subjects = useSearchRank(data) ?? [];
  const [searchKeywords, setSearchKeywords] = useState('');
  const { openScheduleModal } = useScheduleModal();

  const { selectedDays, selectedDepartment, selectedGrades } = useFilterScheduleStore();

  const filteredData = useDeferredValue(
    useFilteringSubjects({
      subjects,
      searchKeywords,
      selectedDays,
      selectedDepartment,
      selectedGrades,
    }),
  );

  return (
    <div className="w-full h-screen md:basis-1/3 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox
        type="text"
        value={searchKeywords}
        placeholder="과목명 검색"
        onDelete={() => setSearchKeywords('')}
        onChange={e => setSearchKeywords(e.target.value)}
      />
      <div className="flex items-center flex-wrap gap-2 mr-20">
        <h3 className="font-semibold text-gray-700">필터링</h3>
        <FilterDelete />
        <DepartmentFilter />
        <CreditFilter />
        <CuriTypeFilter />
        <GradeFilter />
        <DayFilter />
        <SeatFilter />
        <WishFilter />
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
