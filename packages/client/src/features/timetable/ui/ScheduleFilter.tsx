/**
 * 확신의 Widgets
 */
import GenericMultiSelectFilter from '../../filtering/ui/GenericMultiSelectFilter.tsx';
import { FilterDomains, getCategories } from '@/utils/filtering/filterDomains.ts';
import { useScheduleSearchStore } from '@/shared/model/useFilterStore.ts';
import { useState } from 'react';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import DepartmentSelectFilter from '../../filtering/ui/DepartmentFilter.tsx';
import FilterDelete from '../../filtering/ui/FilterDelete.tsx';
import useSubject from '@/entities/subjects/api/useSubject.ts';
import FilteringModal from '../../../widgets/filtering/ui/FilteringModal.tsx';
import { Flex } from '../../../../../allcll-ui';

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
    <Flex direction="flex-wrap" align="items-center" gap="gap-2" className="w-full">
      <FilteringButton handleOpenFilter={() => setIsFilterModalOpen(true)} />
      <DepartmentSelectFilter setFilter={setFilters} selectedValue={filters.department} />

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

      {filters.note?.length > 0 && (
        <GenericMultiSelectFilter
          filterKey="note"
          options={FilterDomains.remark}
          selectedValues={filters.note ?? []}
          setFilter={setFilters}
        />
      )}

      {filters.categories?.length > 0 && (
        <GenericMultiSelectFilter
          filterKey="categories"
          options={categoryOptions}
          selectedValues={(filters.categories as string[]) ?? []}
          setFilter={setFilters}
        />
      )}

      {filters.classroom?.length > 0 && (
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
    </Flex>
  );
}

export default ScheduleFilter;
