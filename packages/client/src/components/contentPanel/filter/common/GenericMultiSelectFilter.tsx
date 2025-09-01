import MultiSelectFilterOption from '@/components/common/filter/MultiSelectFilterOption';
import useMobile from '@/hooks/useMobile';
import { Filters } from '@/store/useFilterStore.ts';
import { FilterItemProps, OptionType } from '@/utils/types';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';

interface GenericMultiSelectFilterProps<VALUE extends string | number> {
  filterKey: keyof Filters;
  options: OptionType<VALUE>[];
  labelPrefix: string;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
  selectedValues: VALUE[] | null;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  className?: string;
}

function GenericMultiSelectFilter<T extends string | number>({
  filterKey,
  options,
  labelPrefix,
  ItemComponent,
  selectedValues,
  setFilter,
  className,
}: GenericMultiSelectFilterProps<T>) {
  const isMobile = useMobile();

  const getLabelPrefix = (selectedValues: T[]) => {
    const firstSelectedLabel = options.find(opt => opt.value === selectedValues[0])?.label;
    if (selectedValues.length === 0) return labelPrefix;
    if (selectedValues.length === 1) return firstSelectedLabel;

    return firstSelectedLabel + ' 외 ' + (selectedValues.length - 1) + '개';
  };

  const labelValue = getLabelPrefix(selectedValues ?? []) || '';

  return isMobile ? (
    <MultiSelectFilterOption<T>
      labelPrefix={labelPrefix}
      selectedValues={selectedValues ?? []}
      field={filterKey}
      setFilter={(field, value) => setFilter(field, value as Filters[typeof field])}
      options={options}
      ItemComponent={Chip}
      className="w-full flex flex-row gap-2"
    />
  ) : (
    <Filtering label={labelValue} selected={(selectedValues ?? []).length > 0} className={className}>
      <MultiSelectFilterOption<T>
        labelPrefix={labelPrefix}
        selectedValues={selectedValues ?? []}
        field={filterKey}
        setFilter={(field, value) => setFilter(field, value as Filters[typeof field])}
        options={options}
        ItemComponent={ItemComponent}
        className="min-w-max"
      />
    </Filtering>
  );
}

export default GenericMultiSelectFilter;
