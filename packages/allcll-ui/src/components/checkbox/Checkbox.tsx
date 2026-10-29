import { useId, type ComponentPropsWithRef, type KeyboardEvent } from 'react';
import { CheckmarkIcon } from '../../icons';
import { useIsInPopoverContent } from '../popover/popover-content/PopoverContentContext';

interface ICheckbox extends ComponentPropsWithRef<'input'> {
  label?: string;
}

function Checkbox({ label, ...rest }: Readonly<ICheckbox>) {
  const reactId = useId();
  const isInPopover = useIsInPopoverContent();
  const inputId = label ? `checkbox-${label}` : `checkbox-${reactId}`;

  const inputClass = `w-4 h-4 rounded-sm border flex-shrink-0 appearance-none flex items-center justify-center
    ${getCheckboxClass(!!rest.checked)}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.click();
    }

    rest.onKeyDown?.(e);
  };

  return (
    <label
      htmlFor={inputId}
      className={`flex flex-row items-center cursor-pointer select-none ${isInPopover ? 'gap-1.5 text-sm' : 'gap-3 text-sm md:text-base'}`}
    >
      <div className="relative w-4 h-4">
        <input
          id={inputId}
          type="checkbox"
          aria-checked={rest.checked}
          aria-label={label ? undefined : 'toggle checkbox'}
          className={inputClass}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {rest.checked && (
          <CheckmarkIcon className="text-primary-500 w-3 h-3 absolute inset-0 m-auto pointer-events-none" />
        )}
      </div>

      {label && <span className={`${rest.checked ? 'text-primary-500' : 'text-gray-600'}`}>{label}</span>}
    </label>
  );
}

Checkbox.layout = 'flex' as const;

function getCheckboxClass(checked: boolean) {
  return checked
    ? `
      bg-primary-50
      border-primary-500
    `
    : `
      bg-white
      border-gray-400
      hover:bg-gray-50
    `;
}

export default Checkbox;
