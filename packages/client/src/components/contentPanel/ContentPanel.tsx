import { useDeferredValue, useState } from 'react';
import { FilteredSubjectCards } from './subject/FilteredSubjectCards';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import FilterDelete from '@/components/contentPanel/filter/FilterDelete.tsx';
import { isFilterEmpty, useScheduleSearchStore } from '@/store/useFilterStore.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import DepartmentFilter from './filter/DepartmentFilter';
import SearchBox from '../common/SearchBox';
import FilteringModal from '../wishTable/FilteringModal';
import FilterSvg from '@/assets/filter.svg?react';
import GenericMultiSelectFilter from './filter/common/GenericMultiSelectFilter';
import ScheduleFilter from './filter/config/schedule';

const initSchedule = new ScheduleAdapter().toUiData();

function ContentPanel() {
  const { openScheduleModal } = useScheduleModal();
  const { data, isPending } = useWishes();
  const subjects = useSearchRank(data) ?? [];

  const filters = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);
  const filteredData = useDeferredValue(useFilteringSubjects(subjects, filters));

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        <button
          className="p-2 w-8 h-8 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100 justify-center"
          aria-label="필터 수정"
          title="필터 수정"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FilterSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>

        <DepartmentFilter department={filters.department} setFilter={setFilters} />

        {ScheduleFilter.map(filter => {
          if (isFilterEmpty(filter.filterKey, filters[filter.filterKey]) && !filter.default) return null;
          return (
            <GenericMultiSelectFilter
              key={filter.filterKey}
              filterKey={filter.filterKey}
              options={filter.options}
              label={filter.label ?? ''}
              labelPrefix={filter.labelPrefix}
              ItemComponent={filter.ItemComponent}
              selectedValues={
                Array.isArray(filters[filter.filterKey]) ? (filters[filter.filterKey] as (string | number)[]) : null
              }
              setFilter={setFilters}
              className="min-w-max"
            />
          );
        })}
        <FilterDelete filters={filters} resetFilter={resetFilter} />

        {isFilterModalOpen && (
          <FilteringModal filterStore={useScheduleSearchStore} onClose={() => setIsFilterModalOpen(false)} />
        )}
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
