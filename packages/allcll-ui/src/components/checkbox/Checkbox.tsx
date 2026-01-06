import CheckSvg from '@/assets/check.svg?react';
import type { KeyboardEvent } from 'react';
import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';

interface ICheckbox extends ComponentPropsWithRef<'input'> {
  label?: string;
}

function Checkbox({ label, ...rest }: Readonly<ICheckbox>) {
  const reactId = useId();
  const inputId = label ? `checkbox-${label}` : `checkbox-${reactId}`;

  const inputClass = `w-5 h-5 rounded-sm border flex-shrink-0 appearance-none flex items-center justify-center
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
      className="flex flex-row items-center gap-3 text-sm md:text-base cursor-pointer select-none"
    >
      <div className="relative w-5 h-5">
        <input
          id={inputId}
          type="checkbox"
          aria-checked={rest.checked}
          aria-label={label ? undefined : 'toggle checkbox'}
          className={inputClass}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {rest.checked && <CheckSvg className="text-blue-500 w-4 h-4 absolute inset-0 m-auto pointer-events-none" />}
      </div>

      {label && <span className={`${rest.checked ? 'text-blue-500' : 'text-gray-600'}`}>{label}</span>}
    </label>
  );
}

Checkbox.layout = 'flex' as const;

function getCheckboxClass(checked: boolean) {
  return checked
    ? `
      bg-blue-50
      border-blue-500
    `
    : `
      bg-white
      border-gray-400
      hover:bg-gray-50
    `;
}

export default Checkbox;
