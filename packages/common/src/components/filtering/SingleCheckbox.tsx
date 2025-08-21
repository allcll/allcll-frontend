import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

interface IMultiCheckboxFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValue: VALUE | null;
  field: string;
  setFilterSchedule: (field: string, value: VALUE | null) => void;
  options: OptionType<VALUE>[];
  selected: boolean;
  className?: string;
}

function MultiCheckboxFilter<VALUE extends string | number>({
  labelPrefix,
  selectedValue,
  field,
  setFilterSchedule,
  options,
  selected,
  className = '',
}: Readonly<IMultiCheckboxFilter<VALUE>>) {
  const getFilteringLabel = () => {
    if (!selectedValue) {
      return labelPrefix;
    }

    return options.find(option => option.value === selectedValue)?.label || labelPrefix;
  };

  const handleChangeCheckbox = (optionValue: VALUE) => {
    const checked = selectedValue === optionValue;
    const newValue = checked ? null : optionValue;

    setFilterSchedule(field, newValue);
  };

  return (
    <Filtering label={getFilteringLabel()} selected={selected} className={className}>
      {options.map(option => (
        <Checkbox
          key={String(option.value)}
          label={option.label}
          checked={selectedValue === option.value}
          onChange={() => handleChangeCheckbox(option.value)}
        />
      ))}
    </Filtering>
  );
}

export default MultiCheckboxFilter;
