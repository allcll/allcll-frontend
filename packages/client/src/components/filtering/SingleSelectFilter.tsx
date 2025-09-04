import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore';
import { getLabelFormatter, labelPrefix } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps, RangeMinMaxFilter } from '@/utils/types';
import MinMaxFilter from './MinMaxFilter';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface ISingleSelectFilter<K extends keyof Filters> {
  selectedValue: FilterValueType<K> | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K> | null) => void;
  options: FilterValueType<K>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps>;
  isMinMax?: boolean;
}

function SingleSelectFilterOption<K extends keyof Filters>({
  selectedValue,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  className,
  isMinMax = false,
}: Readonly<ISingleSelectFilter<K>>) {
  const handleChangeCheckbox = (optionValue: FilterValueType<K>) => {
    const checked = selectedValue === optionValue;
    const newValue = checked ? null : optionValue;

    setFilter(filterKey, newValue);
  };

  const handleClickReset = () => {
    setFilter(filterKey, null);
  };

  const labelFormatters = getLabelFormatter();

  return (
    <div className="relative inline-block">
      <label className="text-xs text-gray-500 sm:text-gray-600 sm:text-base">{labelPrefix[filterKey]}</label>
      <div
        className={`
        gap-2 grid [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))]
        grid grid-cols-2 pt-2
        min-w-max
        ${className ?? ''}
    `}
      >
        {options.map(option => (
          <ItemComponent
            key={String(option)}
            label={labelFormatters[filterKey]?.(option) ?? String(option)}
            selected={selectedValue === option}
            onClick={() => handleChangeCheckbox(option)}
          />
        ))}
      </div>
      {isMinMax && (
        <div className="mt-2">
          <MinMaxFilter
            selectedValue={selectedValue as RangeMinMaxFilter | null}
            filterKey={filterKey}
            setFilter={(filterKey, value) => setFilter(filterKey, value as FilterValueType<K> | null)}
            options={options}
          />
        </div>
      )}
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

export default SingleSelectFilterOption;
