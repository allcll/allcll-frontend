import useMobile from '@/hooks/useMobile';
import { Filters } from '@/store/useFilterStore.ts';
import { getMultiSelectedLabel } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps } from '@/utils/types';
import Filtering from '@common/components/filtering/Filtering';
import MultiSelectFilter from './MultiSelectFilter';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface GenericMultiSelectFilterProps<K extends keyof Filters> {
  filterKey: K;
  options: FilterValueType<K>[];
  selectedValues: FilterValueType<K>[];
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  ItemComponent: React.ComponentType<FilterItemProps>;
  className?: string;
}

function GenericMultiSelectFilter<K extends keyof Filters>({
  filterKey,
  ItemComponent,
  selectedValues,
  options,
  setFilter,
  className,
}: GenericMultiSelectFilterProps<K>) {
  const isMobile = useMobile();

  const selectedMultiChipLabel = getMultiSelectedLabel(filterKey, selectedValues);

  const MultiFilterContent = (
    <MultiSelectFilter
      filterKey={filterKey}
      selectedValues={selectedValues}
      setFilter={(field, value) => setFilter(field, value ?? [])}
      options={options}
      ItemComponent={ItemComponent}
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
