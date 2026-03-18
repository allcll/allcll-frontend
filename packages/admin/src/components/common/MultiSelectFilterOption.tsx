import { Label } from '@allcll/allcll-ui';
import ResetSvg from '@/assets/reset-blue.svg?react';

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
  labelPrefix?: string;
  selectedValues: VALUE[];
  setFilter: (value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  className?: string;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
}

function MultiSelectFilterOption<VALUE extends string | number>({
  labelPrefix,
  selectedValues,

  setFilter,
  options,
  className,
  ItemComponent,
}: Readonly<IMultiSelectFilter<VALUE>>) {
  const isAllSelected = selectedValues.includes(0 as VALUE);

  const checkSelected = (value: VALUE) => {
    if (isAllSelected) return true;
    return selectedValues.includes(value);
  };

  const handleChangeCheckbox = (optionValue: VALUE) => {
    const isCurrentlyAll = selectedValues.includes(0 as VALUE);

    if (optionValue === (0 as VALUE)) {
      if (isCurrentlyAll) {
        setFilter([]);
        return;
      } else {
        const allValues = options.map(option => option.value);
        setFilter(allValues);
        return;
      }
    }

    const checked = selectedValues.includes(optionValue);
    console.log('checked', checked);

    const newValues = checked
      ? selectedValues.filter(selected => selected !== optionValue)
      : [...selectedValues, optionValue];

    setFilter(newValues);
  };

  const handleClickReset = () => {
    setFilter([]);
  };

  return (
    <div className="relative inline-block">
      <Label>{labelPrefix ?? ''}</Label>
      <div
        className={`
          gap-y-2 
          ${options.length > 6 ? 'sm:grid grid-cols-2 gap-x-4' : 'sm:flex flex-col'}
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
