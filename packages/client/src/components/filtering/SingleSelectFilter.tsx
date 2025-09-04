import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore';
import { getLabelFormatter, labelPrefix } from '@/utils/filtering/getFilteringFormatter';
import { FilterItemProps } from '@/utils/types';

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

interface ISingleSelectFilter<K extends keyof Filters> {
  selectedValue: FilterValueType<K> | null;
  filterKey: K;
  setFilter: (field: K, value: FilterValueType<K> | null) => void;
  options: FilterValueType<K>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps>;
}

function SingleSelectFilterOption<K extends keyof Filters>({
  selectedValue,
  filterKey,
  setFilter,
  options,
  ItemComponent,
  className,
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
      <h3 className="text-xs mb-1 sm:text-lg text-gray-500 font-medium sm:text-gray-600">{labelPrefix[filterKey]}</h3>

      <div
        className={`
        gap-2 grid [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))]
        ${options.length > 6 ? 'md:grid md:grid-cols-2 md:max-h-50 md:overflow-y-auto' : 'md:flex md:flex-col md:max-h-50 md:overflow-y-auto'}
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
