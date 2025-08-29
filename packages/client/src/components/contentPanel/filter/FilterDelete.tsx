import Chip from '@common/components/chip/Chip';
import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { Filters } from '@/store/useFilterStore.ts';

interface FilterDelete {
  filters: Filters;
  resetFilter: () => void;
}

function FilterDelete({ filters, resetFilter }: FilterDelete) {
  const { department, grades, time, categories, credits, wishRange, seatRange } = filters;

  const isFiltered =
    department.length || grades.length || time.length || categories.length || credits.length || wishRange || seatRange;

  if (!isFiltered) {
    return null;
  }

  return <Chip label={<RemoveFilterSvg className="w-4 h-4" />} selected={true} onClick={resetFilter} />;
}

export default FilterDelete;
