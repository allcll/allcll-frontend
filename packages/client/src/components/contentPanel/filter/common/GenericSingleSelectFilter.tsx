import SingleSelectFilterOption from '@/components/common/filter/SingleSelectFilter';
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

interface GenericSingleSelectFilterProps<VALUE extends string | number> {
  filterKey: keyof Filters;
  options: OptionType<VALUE>[];
  label: string;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
  selectedValue: VALUE | null;
  setFilter: (field: keyof Filters, value: Filters[keyof Filters]) => void;
}

function GenericSingleSelectFilter<T extends string | number>({
  filterKey,
  options,
  label,
  ItemComponent,
  selectedValue,
  setFilter,
}: GenericSingleSelectFilterProps<T>) {
  const isMobile = useMobile();

  const getLabelPrefix = (selectedValue: T | null) => {
    if (!selectedValue) return label;
    if (filterKey === 'classroom') return options.find(opt => opt.value === selectedValue)?.label;

    return '';
  };

  const labelPrefix = getLabelPrefix(selectedValue as T | null) || '';

  return (
    <>
      {isMobile ? (
        <SingleSelectFilterOption<T>
          labelPrefix={label}
          selectedValue={selectedValue as T}
          field={filterKey}
          setFilter={(field, value) => setFilter(field, value as Filters[keyof Filters])}
          options={options}
          ItemComponent={Chip}
          className="w-full flex flex-row gap-2"
        />
      ) : (
        <Filtering label={labelPrefix} selected={!!selectedValue}>
          <SingleSelectFilterOption<T>
            labelPrefix={label}
            selectedValue={selectedValue as T}
            field={filterKey}
            setFilter={(field, value) => setFilter(field, value as Filters[keyof Filters])}
            options={options}
            ItemComponent={ItemComponent}
          />
        </Filtering>
      )}
    </>
  );
}

export default GenericSingleSelectFilter;
