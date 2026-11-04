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
  const handleChangeCheckbox = (optionValue: VALUE) => {
    const checked = selectedValues.includes(optionValue);

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
      <div className={`grid gap-x-4 gap-y-2 ${options.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'} ${className}`}>
        {options.map(option => (
          <ItemComponent
            key={String(option.value)}
            label={option.label}
            selected={selectedValues.includes(option.value)}
            onClick={() => handleChangeCheckbox(option.value)}
            value={option.value}
          />
        ))}
      </div>

      <div className="flex justify-end w-full mt-3 pt-1.5 -mb-1.5 border-t border-gray-100">
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
