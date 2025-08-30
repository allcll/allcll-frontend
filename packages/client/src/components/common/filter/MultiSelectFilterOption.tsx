import ResetSvg from '@/assets/reset-blue.svg?react';
import { Filters } from '@/store/useFilterStore';

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

interface IMultiSelectFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValues: VALUE[];
  field: keyof Filters;
  setFilter: (field: keyof Filters, value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
}

function MultiSelectFilterOption<VALUE extends string | number>({
  labelPrefix,
  selectedValues,
  field,
  setFilter,
  options,
  className,
  ItemComponent,
}: Readonly<IMultiSelectFilter<VALUE>>) {
  const checkSelected = (value: VALUE) => {
    return selectedValues.includes(value);
  };

  const handleChangeCheckbox = (optionValue: VALUE) => {
    const checked = selectedValues.includes(optionValue);
    const newValues = checked
      ? selectedValues.filter(selected => selected !== optionValue)
      : [...selectedValues, optionValue];

    setFilter(field, newValues);
  };

  const handleClickReset = () => {
    setFilter(field, []);
  };

  return (
    <div className="relative inline-block">
      <h3 className="text-xs mb-1 md:text-lg text-gray-500 font-medium md:text-gray-600">{labelPrefix}</h3>
      <div
        className={`
          gap-y-2 
          ${options.length > 6 ? 'md:grid grid-cols-2 gap-x-4' : 'md:flex flex-col'}
          ${className}
          grid grid-cols-2 gap-x-4
        `}
      >
        {options.map(option => (
          <ItemComponent
            key={String(option.value)}
            label={option.label}
            selected={checkSelected(option.value)}
            onClick={() => handleChangeCheckbox(option.value)}
            value={option.value}
          />
        ))}
      </div>
      <div className="flex justify-end w-full mt-2">
        <button
          onClick={() => handleClickReset()}
          className="text-blue-500 cursor-pointer sm:text-sm text-xs px-1 py-0.5"
        >
          <ResetSvg className="inline w-4 h-4 mr-1 mb-0.5" />
          필터 초기화
        </button>
      </div>
    </div>
  );
}

export default MultiSelectFilterOption;
