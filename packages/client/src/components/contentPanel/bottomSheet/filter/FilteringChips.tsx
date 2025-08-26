import Chip from '@common/components/chip/Chip';
import { OptionType } from '@common/components/filtering/SingleSelectFilter';

interface IFilterChips<VALUE extends string | number> {
  label: string;
  field: string;
  selectedValue: VALUE[];
  setFilterSchedule: (field: string, value: VALUE[]) => void;
  options: OptionType<VALUE>[];
  className?: string;
}

function FilterChips<VALUE extends string | number>({
  label,
  field,
  selectedValue,
  setFilterSchedule,

  options,
}: Readonly<IFilterChips<VALUE>>) {
  const handleChangeChip = (optionValue: VALUE) => {
    const selected = selectedValue.includes(optionValue);
    const newValues = selected
      ? selectedValue.filter(selected => selected !== optionValue)
      : [...selectedValue, optionValue];

    setFilterSchedule(field, newValues);
  };

  return (
    <div className="w-full flex gap-2 flex-col justify-center">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map(option => (
          <Chip
            key={option.value}
            label={option.label}
            selected={selectedValue.includes(option.value)}
            onClick={() => handleChangeChip(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default FilterChips;
