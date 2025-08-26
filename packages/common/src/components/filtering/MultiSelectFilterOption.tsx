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
  field: string;
  setFilter: (field: string, value: VALUE[]) => void;
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
      <h3 className="text-xs sm:text-lg mb-2 text-gray-500 font-medium sm:text-gray-600">{labelPrefix}</h3>
      <div
        className={`
        gap-y-2
        ${(className ?? options.length > 6) ? 'grid grid-cols-2 gap-x-4' : 'flex flex-col'}
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
          초기화
        </button>
      </div>
    </div>
  );
}

export default MultiSelectFilterOption;
