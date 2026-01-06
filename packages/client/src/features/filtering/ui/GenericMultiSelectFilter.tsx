import useMobile from '@/shared/lib/useMobile.ts';
import { Filters } from '@/shared/model/useFilterStore.ts';
import { getMultiSelectedLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';
import Filtering from '@common/components/filtering/Filtering.tsx';
import MultiSelectFilter from './MultiSelectFilter.tsx';
import Chip from '@common/components/chip/Chip.tsx';
import CheckboxAdapter from '@/features/filtering/ui/CheckboxAdapter.tsx';
import { FilterItemProps, FilterValueType } from '@/shared/model/types.ts';

interface GenericMultiSelectFilterProps<K extends keyof Filters> {
  filterKey: K;
  options: FilterValueType<K>[];
  selectedValues: FilterValueType<K>[];
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  ItemComponent?: React.ComponentType<FilterItemProps>;
  className?: string;
}

function GenericMultiSelectFilter<K extends keyof Filters>({
  filterKey,
  selectedValues,
  options,
  setFilter,
  ItemComponent,
  className,
}: GenericMultiSelectFilterProps<K>) {
  const isMobile = useMobile();

  const selectedMultiChipLabel = getMultiSelectedLabel(filterKey, selectedValues as unknown as Filters[K]);

  const Generalcomponent = isMobile ? Chip : CheckboxAdapter;

  const MultiFilterContent = (
    <MultiSelectFilter
      filterKey={filterKey}
      selectedValues={selectedValues}
      setFilter={(field, value) => setFilter(field, value ?? [])}
      options={options}
      ItemComponent={ItemComponent ? ItemComponent : Generalcomponent}
    />
  );

  return isMobile ? (
    MultiFilterContent
  ) : (
    <Filtering label={selectedMultiChipLabel} selected={(selectedValues ?? []).length > 0} className={className}>
      {MultiFilterContent}
    </Filtering>
  );
}

export default GenericMultiSelectFilter;
