import { Popover, PopoverGroup, ListboxOption } from '@allcll/allcll-ui';
import CheckSvg from '@/assets/checkbox-blue.svg?react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Select({ options, value, onChange, placeholder = '선택해주세요' }: SelectProps) {
  const selectedOption = options.find(option => option.value === value);
  const label = selectedOption ? selectedOption.label : placeholder;

  return (
    <PopoverGroup>
      <Popover>
        <Popover.Trigger label={label} selected={!!value} />
        <Popover.Content>
          <div className="max-h-60 overflow-y-auto min-w-[120px]">
            {options.map(option => (
              <ListboxOption
                key={option.value}
                selected={option.value === value}
                left={option.label}
                right={option.value === value ? <CheckSvg className="w-4 h-4 shrink-0" /> : null}
                onSelect={() => onChange(option.value)}
              />
            ))}
          </div>
        </Popover.Content>
      </Popover>
    </PopoverGroup>
  );
}

export default Select;
