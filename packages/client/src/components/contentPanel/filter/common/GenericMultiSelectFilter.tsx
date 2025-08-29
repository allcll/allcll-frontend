import MultiSelectFilterOption from '@/components/common/filter/MultiSelectFilterOption';
import useMobile from '@/hooks/useMobile';
import { Filters } from '@/store/useFilterStore.ts';
import Chip from '@common/components/chip/Chip';
import Filtering from '@common/components/filtering/Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

interface FilterItemProps<VALUE extends string | number> {
  label: string;
  selected: boolean;
  onClick: () => void;
  value: VALUE;
}

interface GenericMultiSelectFilterProps<VALUE extends string | number> {
  filterKey: keyof Filters;
  options: OptionType<VALUE>[];
  label: string;
  labelPrefix: string;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
  selectedValues: VALUE[] | null;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
  className?: string;
}

function GenericMultiSelectFilter<T extends string | number>({
  filterKey,
  options,
  label,
  labelPrefix,
  ItemComponent,
  selectedValues,
  setFilter,
  className,
}: GenericMultiSelectFilterProps<T>) {
  const isMobile = useMobile();

  const getLabelPrefix = (selectedValues: T[]) => {
    if (selectedValues.length === 0) return label;
    if (selectedValues.length === 1) return selectedValues[0] + label;

    if (filterKey === 'classroom')
      return options.find(opt => opt.value === selectedValues[0])?.label + ' 외 ' + (selectedValues.length - 1) + '개';

    return selectedValues[0] + label + ' 외 ' + (selectedValues.length - 1) + '개';
  };

  const labelValue = getLabelPrefix(selectedValues as T[]);

  return (
    <>
      {isMobile ? (
        <MultiSelectFilterOption<T>
          labelPrefix={labelPrefix}
          selectedValues={selectedValues as T[]}
          field={filterKey}
          setFilter={(field, value) => setFilter(field, value as Filters[typeof field])}
          options={options}
          ItemComponent={Chip}
          className="w-full flex flex-row gap-2"
        />
      ) : (
        <Filtering label={labelValue} selected={(selectedValues as T[]).length > 0} className={className}>
          <MultiSelectFilterOption<T>
            labelPrefix={labelPrefix}
            selectedValues={selectedValues as T[]}
            field={filterKey}
            setFilter={(field, value) => setFilter(field, value as Filters[typeof field])}
            options={options}
            ItemComponent={ItemComponent}
            className="min-w-max"
          />
        </Filtering>
      )}
    </>
  );
}

export default GenericMultiSelectFilter;
