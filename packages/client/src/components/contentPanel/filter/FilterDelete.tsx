import Chip from '@common/components/chip/Chip';
import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';

function FilterDelete() {
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);
  const { department, grades, time, categories, credits } = useScheduleSearchStore(state => state.filters);

  const isFiltered = department.length || grades.length || time.length || categories.length || credits.length;

  if (!isFiltered) {
    return null;
  }

  return <Chip label={<RemoveFilterSvg className="w-4 h-4" />} selected={true} onClick={resetFilter} />;
}

export default FilterDelete;
