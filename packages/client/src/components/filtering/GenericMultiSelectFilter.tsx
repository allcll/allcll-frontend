import useMobile from '@/hooks/useMobile';
import { Filters } from '@/store/useFilterStore.ts';
import { getMultiSelectedLabel } from '@/utils/filtering/getFilteringFormatter';
import Filtering from '@common/components/filtering/Filtering';
import MultiSelectFilter from './MultiSelectFilter';
import Chip from '@common/components/chip/Chip';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import { FilterItemProps } from '@/utils/types';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

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

  const selectedMultiChipLabel = getMultiSelectedLabel(filterKey, selectedValues);

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
