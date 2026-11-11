import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDownIcon } from '../../icons';
import { FIELD_CLASS } from '../../config';

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  className?: string;
}

function Select({ className = '', children, ...rest }: SelectProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select {...rest} className={`w-full h-full appearance-none pl-3 pr-8 ${FIELD_CLASS}`}>
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400"
      />
    </div>
  );
}

export default Select;
