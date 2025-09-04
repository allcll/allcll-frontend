import FilteringModal from '../wishTable/FilteringModal';
import GenericMultiSelectFilter from '../filtering/GenericMultiSelectFilter';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import { FilterDomains } from '@/utils/filtering/filterDomains';
import { useScheduleSearchStore } from '@/store/useFilterStore';
import { useState } from 'react';
import GenericSingleSelectFilter from '../filtering/GenericSingleSelectFilter';
import Chip from '@common/components/chip/Chip';
import FilteringButton from '../filtering/button/FilteringButton';
import DepartmentSelectFilter from '../filtering/DepartmentFilter';
import DayFilter from '../filtering/DayFilter';
import FilterDelete from '../filtering/FilterDelete';

function ScheduleFilter() {
  const filters = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="flex items-center flex-wrap gap-2 mr-20">
      <FilteringButton handleOpenFilter={() => setIsFilterModalOpen(true)} />
      <DepartmentSelectFilter department={filters.department} setFilter={setFilters} />
      <DayFilter times={filters.time} setFilter={setFilters} />

      <GenericMultiSelectFilter
        filterKey="credits"
        options={FilterDomains.credits}
        selectedValues={filters.credits ?? []}
        setFilter={setFilters}
        ItemComponent={CheckboxAdapter}
      />

      <GenericMultiSelectFilter
        filterKey="grades"
        options={FilterDomains.grades}
        selectedValues={filters.grades ?? []}
        setFilter={setFilters}
        ItemComponent={CheckboxAdapter}
      />

      <GenericMultiSelectFilter
        filterKey="classroom"
        options={FilterDomains.classRoom}
        selectedValues={filters.classroom ?? []}
        setFilter={setFilters}
        ItemComponent={CheckboxAdapter}
      />

      <GenericMultiSelectFilter
        filterKey="note"
        options={FilterDomains.remark}
        selectedValues={filters.note ?? []}
        setFilter={setFilters}
        ItemComponent={CheckboxAdapter}
      />

      <GenericMultiSelectFilter
        filterKey="categories"
        options={filters.categories}
        selectedValues={(filters.categories as string[]) ?? []}
        setFilter={setFilters}
        ItemComponent={CheckboxAdapter}
      />

      <GenericSingleSelectFilter
        filterKey="wishRange"
        options={FilterDomains.wishRange}
        selectedValue={filters.wishRange ?? null}
        setFilter={setFilters}
        ItemComponent={Chip}
      />

      <GenericSingleSelectFilter
        filterKey="seatRange"
        options={FilterDomains.seatRange}
        selectedValue={filters.seatRange ?? null}
        setFilter={setFilters}
        ItemComponent={Chip}
      />

      <FilterDelete filters={filters} resetFilter={resetFilter} />
      {isFilterModalOpen && (
        <FilteringModal filterStore={useScheduleSearchStore} onClose={() => setIsFilterModalOpen(false)} />
      )}
    </div>
  );
}

export default ScheduleFilter;
