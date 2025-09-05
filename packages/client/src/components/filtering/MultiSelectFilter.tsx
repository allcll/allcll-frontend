import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore';
import { getLabelFormatter, labelPrefix } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps, FilterValueType } from '@/utils/types';

interface IMultiSelectFilter<K extends keyof Filters> {
  selectedValues: FilterValueType<K>[] | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K>[] | null) => void;
  options: FilterValueType<K>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps>;
}

function MultiSelectFilter<K extends keyof Filters>({
  selectedValues,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  className,
}: Readonly<IMultiSelectFilter<K>>) {
  const labelFormatters = getLabelFormatter();

  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    console.log('optionValue', optionValue);
    const checked = selectedValues?.includes(optionValue);
    const newValues = checked
      ? selectedValues?.filter(selected => selected !== optionValue)
      : [...(selectedValues ?? []), optionValue];

    setFilter(filterKey, newValues ?? null);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  return (
    <div className="relative inline-block ">
      <label className="text-xs text-gray-500 sm:text-gray-600 sm:text-base">{labelPrefix[filterKey]}</label>
      <div
        className={`
        gap-2 grid [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))]
        ${options.length > 6 ? 'grid grid-cols-2' : 'flex flex-col'} pt-2
        ${className ?? ''}
    `}
      >
        {options.map(option => (
          <ItemComponent
            key={String(option)}
            label={labelFormatters[filterKey]?.(option) ?? String(option)}
            selected={selectedValues?.includes(option) ?? false}
            onClick={() => handleChangeCheckbox(option)}
          />
        ))}
      </div>
      <div className="flex justify-end w-full mt-2">
        <button
          onClick={() => handleClickReset()}
          className="text-gray-500 hover:text-blue-500 cursor-pointer sm:text-sm text-xs px-1 py-0.5"
        >
          <ResetSvg className="inline w-4 h-4 mr-1 mb-0.5" stroke="currentColor" />
          초기화
        </button>
      </div>
    </div>
  );
}

export default MultiSelectFilter;
