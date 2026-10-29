import { Button, Label } from '@allcll/allcll-ui';

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
      <Label className="block mb-2">{labelPrefix ?? ''}</Label>
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

      <div className="flex justify-end w-full mt-2 pt-2 border-t border-gray-100">
        <Button
          variant="text"
          size="small"
          color="gray"
          disabled={selectedValues.length === 0}
          onClick={() => handleClickReset()}
        >
          초기화
        </Button>
      </div>
    </div>
  );
}

export default MultiSelectFilterOption;
