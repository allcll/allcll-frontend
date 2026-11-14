import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import { CheckmarkIcon } from '../../icons';

interface ICheckbox extends ComponentPropsWithRef<'input'> {
  label?: string;
}

function Checkbox({ label, ...rest }: Readonly<ICheckbox>) {
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
    <label className="flex flex-row items-center gap-1.5 text-sm cursor-pointer select-none has-disabled:cursor-not-allowed has-disabled:opacity-40">
      <div className="relative w-4 h-4">
        <input type="checkbox" {...rest} className={inputClass} onKeyDown={handleKeyDown} />
        {rest.checked && (
          <CheckmarkIcon className="text-primary-500 w-3 h-3 absolute inset-0 m-auto pointer-events-none" />
        )}
      </div>

      {label && <span className={`${rest.checked ? 'text-primary-500' : 'text-fg-secondary'}`}>{label}</span>}
    </label>
  );
}

Checkbox.layout = 'flex' as const;

function getCheckboxClass(checked: boolean) {
  return checked
    ? `
      bg-primary-subtle
      border-primary-500
    `
    : `
      bg-surface
      border-fg-subtle
      hover:bg-surface-subtle
    `;
}

export default Checkbox;
