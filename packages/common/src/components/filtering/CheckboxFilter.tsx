import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

interface ICheckboxFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValues: VALUE[];
  field: string;
  setFilterSchedule: (field: string, value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  selected: boolean;
  className?: string;
}

function CheckboxFilter<VALUE extends string | number>({
  labelPrefix,
  selectedValues,
  field,
  setFilterSchedule,
  options,
  selected,
  className = '',
}: Readonly<ICheckboxFilter<VALUE>>) {
  const checkSelected = (value: VALUE) => {
    return selectedValues.includes(value);
  };

  const getFilteringLabel = () => {
    if (selectedValues.length === 0) {
      return labelPrefix;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0] + labelPrefix;
    }

    return `${String(selectedValues[0]) + labelPrefix} 외 ${selectedValues.length - 1}개`;
  };

  const handleChangeCheckbox = (optionValue: VALUE) => {
    const checked = selectedValues.includes(optionValue);
    const newValues = checked
      ? selectedValues.filter(selected => selected !== optionValue)
      : [...selectedValues, optionValue];

    setFilterSchedule(field, newValues);
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
    </Filtering>
  );
}

export default CheckboxFilter;
