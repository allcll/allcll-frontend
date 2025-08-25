import Chip from '../chip/Chip';
import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

type Variant = 'checkbox' | 'chip';

interface IMultiCheckboxFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValues: VALUE[];
  field: string;
  variant?: Variant;
  setFilterSchedule: (field: string, value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  selected: boolean;
  className?: string;
}

function MultiCheckboxFilter<VALUE extends string | number>({
  labelPrefix,
  selectedValues,
  field,
  variant = 'checkbox',
  setFilterSchedule,
  options,
  selected,
  className = '',
}: Readonly<IMultiCheckboxFilter<VALUE>>) {
  const checkSelected = (value: VALUE) => {
    return selectedValues.includes(value);
  };

  const getFilteringLabel = () => {
    if (selectedValues.length === 0) {
      return labelPrefix;
    }

    const label = options.find(option => option.value === selectedValues[0])?.label || labelPrefix;
    if (selectedValues.length === 1) {
      return label;
    }

    return `${label} 외 ${selectedValues.length - 1}개`;
  };

  const handleChangeCheckbox = (optionValue: VALUE) => {
    const checked = selectedValues.includes(optionValue);
    const newValues = checked
      ? selectedValues.filter(selected => selected !== optionValue)
      : [...selectedValues, optionValue];

    setFilterSchedule(field, newValues);
  };

  const handleClickReset = () => {
    setFilterSchedule(field, []);
  };

  return (
    <Filtering label={getFilteringLabel()} selected={selected} className={className}>
      <h3 className="text-md font-medium text-gray-600">{labelPrefix}</h3>
      <div className={`${options.length > 6 ? 'grid grid-cols-2 gap-x-4' : 'flex flex-col'} gap-y-2`}>
        {variant === 'checkbox' &&
          options.map(option => (
            <Checkbox
              key={String(option.value)}
              label={option.label}
              checked={checkSelected(option.value)}
              onChange={() => handleChangeCheckbox(option.value)}
            />
          ))}

        {variant === 'chip' &&
          options.map(option => (
            <Chip
              key={String(option.value)}
              label={option.label}
              selected={checkSelected(option.value)}
              onClick={() => handleChangeCheckbox(option.value)}
            />
          ))}
      </div>
      <div className="flex justify-end w-full mt-2">
        <button onClick={() => handleClickReset()} className="text-blue-500 cursor-pointer text-sm px-1 py-0.5">
          초기화
        </button>
      </div>
    </Filtering>
  );
}

export default MultiCheckboxFilter;
