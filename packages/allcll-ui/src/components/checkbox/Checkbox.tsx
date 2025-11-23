import CheckSvg from '@/assets/check.svg?react';
import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';

interface ICheckbox extends ComponentPropsWithRef<'input'> {
  label?: string;
}

function Checkbox({ label, ...rest }: Readonly<ICheckbox>) {
  const reactId = useId();
  const inputId = label ? `checkbox-${label}` : `checkbox-${reactId}`;

  return (
    <label htmlFor={inputId} className="flex flex-row items-center gap-3 text-md cursor-pointer select-none">
      <div className="relative w-5 h-5">
        <input
          id={inputId}
          type="checkbox"
          aria-checked={rest.checked}
          aria-label={label ? undefined : 'toggle checkbox'}
          className={`
            appearance-none w-5 h-5 rounded-sm border cursor-pointer transition-colors hover:bg-gray-50
            ${rest.checked ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-400'}
          `}
          {...rest}
        />
        {rest.checked && <CheckSvg className="text-blue-500 w-4 h-4 absolute inset-0 m-auto pointer-events-none" />}
      </div>

      {label && <span className={`${rest.checked ? 'text-blue-500' : 'text-gray-600'}`}>{label}</span>}
    </label>
  );
}

export default Checkbox;
