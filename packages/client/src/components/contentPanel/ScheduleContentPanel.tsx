import { useDeferredValue } from 'react';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import SearchBox from '../common/SearchBox';
import ScheduleFilter from './ScheduleFilter';

const initSchedule = new ScheduleAdapter().toUiData();

function ScheduleContentPanel() {
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

      <ScheduleFilter />
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

export default ScheduleContentPanel;
