import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Chip, Flex } from '@allcll/allcll-ui';
import { isFilterEmpty } from '@/features/filtering/lib/filterUtils.ts';

interface FilterDelete {
  filters: Filters;
  resetFilter: () => void;
}

function FilterDelete({ filters, resetFilter }: FilterDelete) {
  const Keys = Object.keys(filters) as (keyof Filters)[];
  const isFiltered = Keys.some(key => !isFilterEmpty(key, filters[key]));

  if (!isFiltered) return null;

  return (
    <Chip
      label={
        <Flex align="items-center" gap="gap-1">
          <span>필터 제거</span>
          <RemoveFilterSvg className="w-4 h-4" />
        </Flex>
      }
      selected={true}
      onClick={resetFilter}
    />
  );
}

export default FilterDelete;
