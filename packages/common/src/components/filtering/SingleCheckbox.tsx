import Chip from '../chip/Chip';
import Checkbox from './Checkbox';
import Filtering from './Filtering';

export interface OptionType<VALUE extends string | number> {
  value: VALUE;
  label: string;
}

type Variant = 'checkbox' | 'chip';

interface ISingleCheckboxFilter<VALUE extends string | number> {
  labelPrefix: string;
  selectedValue: VALUE | null;
  field: string;
  variant?: Variant;
  setFilterSchedule: (field: string, value: VALUE | null) => void;
  options: OptionType<VALUE>[];
  selected: boolean;
  className?: string;
}

function SingleCheckboxFilter<VALUE extends string | number>({
  labelPrefix,
  selectedValue,
  field,
  variant = 'checkbox',
  setFilterSchedule,
  options,
  selected,
  className = '',
}: Readonly<ISingleCheckboxFilter<VALUE>>) {
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

  const handleClickReset = () => {
    setFilterSchedule(field, null);
  };

  return (
    <Filtering label={getFilteringLabel()} selected={selected} className={className}>
      <h3 className="text-gray-700 font-semibold">{labelPrefix}</h3>

      {variant === 'checkbox' &&
        options.map(option => (
          <Checkbox
            key={String(option.value)}
            label={option.label}
            checked={selectedValue === option.value}
            onChange={() => handleChangeCheckbox(option.value)}
          />
        ))}

      <div className="grid grid-cols-2 gap-2">
        {variant === 'chip' &&
          options.map(option => (
            <Chip
              key={String(option.value)}
              label={option.label}
              selected={selectedValue === option.value}
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

export default SingleCheckboxFilter;
