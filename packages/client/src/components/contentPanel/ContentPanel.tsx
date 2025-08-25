import { useDeferredValue } from 'react';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import FilterDelete from '@/components/contentPanel/filter/FilterDelete.tsx';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import CuriTypeFilter from './filter/CuriTypeFilter';
import SeatFilter from './filter/SeatFilter';
import WishFilter from './filter/WishFilter';
import DepartmentFilter from './filter/DepartmentFilter';
import GradeFilter from './filter/GradeFilter';
import DayFilter from './filter/DayFilter';
import CreditFilter from './filter/CreditFilter';
import SearchBox from '../common/SearchBox';

const initSchedule = new ScheduleAdapter().toUiData();

function ContentPanel() {
  const { openScheduleModal } = useScheduleModal();
  const { data, isPending } = useWishes();
  const subjects = useSearchRank(data) ?? [];

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const filteredData = useDeferredValue(useFilteringSubjects(subjects, filters));

  return (
    <div className="w-full h-screen md:basis-1/3 p-4 md:border-t-0 flex flex-col gap-3 bg-white shadow-md rounded-lg">
      <SearchBox
        type="text"
        value={filters.keywords}
        placeholder="과목명 검색"
        onDelete={() => setFilters('keywords', '')}
        onChange={e => setFilters('keywords', e.target.value)}
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
