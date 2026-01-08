import useMobile from '@/shared/lib/useMobile.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { getMultiSelectedLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';
import MultiSelectFilter from './MultiSelectFilter.tsx';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter.tsx';
import { Chip } from '@allcll/allcll-ui';
import Filtering from '@common/components/filtering/Filtering.tsx';
import { FilterItemProps, FilterValueType } from '@/features/filtering/model/types.ts';

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
