import { Chip, ListboxOption } from '@allcll/allcll-ui';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string | null;
  placeholder?: string;
  options: SelectOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function CustomSelect({ value, placeholder, options, isOpen, onToggle, onSelect }: CustomSelectProps) {
  const label = (value ? options.find(option => option.value === value)?.label : null) ?? placeholder ?? '';

  return (
    <div>
      <Chip label={label} selected={isOpen} variant="select" isChipOpen={isOpen} onClick={onToggle} />
      {isOpen && (
        <div className="mt-1 max-h-48 overflow-auto border border-gray-200 rounded-md">
          {options.map(option => (
            <ListboxOption
              key={option.value}
              selected={option.value === value}
              left={<span>{option.label}</span>}
              onSelect={() => onSelect(option.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
