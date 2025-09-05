import GenericMultiSelectFilter from '../filtering/GenericMultiSelectFilter';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains';
import { useScheduleSearchStore } from '@/store/useFilterStore';
import { useState } from 'react';
import FilteringButton from '../filtering/button/FilteringButton';
import DepartmentSelectFilter from '../filtering/DepartmentFilter';
import FilterDelete from '../filtering/FilterDelete';
import useSubject from '@/hooks/server/useSubject';
import FilteringModal from '../filtering/FilteringModal';

function ScheduleFilter() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const filters = useScheduleSearchStore(state => state.filters);
  const setFilters = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  const { data: subjects } = useSubject();
  const categoryOptions = getCategories(subjects ?? [])
    .sort((a, b) => a.localeCompare(b))
    .map(cat => cat);

  return (
    <div className="flex items-center flex-wrap gap-2 mr-20">
      <FilteringButton handleOpenFilter={() => setIsFilterModalOpen(true)} />
      <DepartmentSelectFilter department={filters.department} setFilter={setFilters} />

      <GenericMultiSelectFilter
        filterKey="days"
        options={FilterDomains.days}
        selectedValues={filters.days ?? []}
        setFilter={setFilters}
      />

      <GenericMultiSelectFilter
        filterKey="credits"
        options={FilterDomains.credits}
        selectedValues={filters.credits ?? []}
        setFilter={setFilters}
      />

      <GenericMultiSelectFilter
        filterKey="grades"
        options={FilterDomains.grades}
        selectedValues={filters.grades ?? []}
        setFilter={setFilters}
      />

      {filters.note.length > 0 && (
        <GenericMultiSelectFilter
          filterKey="note"
          options={FilterDomains.remark}
          selectedValues={filters.note ?? []}
          setFilter={setFilters}
        />
      )}

      {filters.categories.length > 0 && (
        <GenericMultiSelectFilter
          filterKey="categories"
          options={categoryOptions}
          selectedValues={(filters.categories as string[]) ?? []}
          setFilter={setFilters}
        />
      )}

      {filters.classroom.length > 0 && (
        <GenericMultiSelectFilter
          filterKey="classroom"
          options={FilterDomains.classRoom}
          selectedValues={filters.classroom ?? []}
          setFilter={setFilters}
        />
      )}

      <FilterDelete filters={filters} resetFilter={resetFilter} />
      {isFilterModalOpen && (
        <FilteringModal filterStore={useScheduleSearchStore} onClose={() => setIsFilterModalOpen(false)} />
      )}
    </div>
  );
}

export default ScheduleFilter;
