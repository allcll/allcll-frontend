import CustomButton from '../Button';
import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

interface IMultiCheckboxFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValues: VALUE[];
  field: string;
  setFilterSchedule: (field: string, value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  selected: boolean;
  className?: string;
}

function MultiCheckboxFilter<VALUE extends string | number>({
  labelPrefix,
  selectedValues,
  field,
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
      {options.map(option => (
        <Checkbox
          key={String(option.value)}
          label={option.label}
          checked={checkSelected(option.value)}
          onChange={() => handleChangeCheckbox(option.value)}
        />
      ))}
      <div className="flex justify-end w-full">
        <CustomButton onClick={() => handleClickReset()} variants="primary" className="text-xs px-1 py-0.5">
          초기화
        </CustomButton>
      </div>
    </Filtering>
  );
}

export default MultiCheckboxFilter;
