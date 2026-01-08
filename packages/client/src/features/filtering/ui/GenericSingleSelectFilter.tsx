import useMobile from '@/shared/lib/useMobile.ts';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { getSingleSelectedLabel } from '@/features/filtering/lib/getFilteringFormatter.ts';
import SingleSelectFilterOption from './SingleSelectFilter.tsx';
import Filtering from '@common/components/filtering/Filtering.tsx';
import { FilterItemProps, FilterValueType } from '@/features/filtering/model/types.ts';

interface GenericSingleSelectFilterProps<K extends keyof Filters> {
  filterKey: K;
  options: FilterValueType<K>[];
  ItemComponent: React.ComponentType<FilterItemProps>;
  selectedValue: FilterValueType<K> | null;
  setFilter: (field: K, value: Filters[K]) => void;
  className?: string;
  isMinMax?: boolean;
}

function GenericSingleSelectFilter<K extends keyof Filters>({
  filterKey,
  options,
  ItemComponent,
  selectedValue,
  setFilter,
  className,
  isMinMax,
}: GenericSingleSelectFilterProps<K>) {
  const isMobile = useMobile();

  const selectedSingleChipLabel = getSingleSelectedLabel(filterKey, selectedValue) ?? '';

  const SingleSelectContent = (
    <SingleSelectFilterOption
      selectedValue={selectedValue}
      filterKey={filterKey}
      setFilter={(filterKey, value) => setFilter(filterKey, value as Filters[K])}
      options={options}
      ItemComponent={ItemComponent}
      isMinMax={isMinMax}
    />
  );

  return isMobile ? (
    SingleSelectContent
  ) : (
    <Filtering label={selectedSingleChipLabel} selected={!!selectedValue} className={className}>
      {SingleSelectContent}
    </Filtering>
  );
}

export default GenericSingleSelectFilter;
