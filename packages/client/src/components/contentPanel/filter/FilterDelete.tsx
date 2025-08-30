import Chip from '@common/components/chip/Chip';
import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { Filters, isFilterEmpty } from '@/store/useFilterStore.ts';

interface FilterDelete {
  filters: Filters;
  resetFilter: () => void;
}

function FilterDelete({ filters, resetFilter }: FilterDelete) {
  const Keys = Object.keys(filters) as (keyof Filters)[];
  const isFiltered = Keys.some(key => !isFilterEmpty(key, filters[key]));

  if (!isFiltered) return null;

  return <Chip label={<RemoveFilterSvg className="w-4 h-4" />} selected={true} onClick={resetFilter} />;
}

export default FilterDelete;
