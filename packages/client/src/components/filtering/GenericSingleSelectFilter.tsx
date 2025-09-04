import useMobile from '@/hooks/useMobile';
import { Filters } from '@/store/useFilterStore.ts';
import { getSingleSelectedLabel } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps, FilterValueType } from '@/utils/types';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from './SingleSelectFilter';

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
