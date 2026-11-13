import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDownIcon } from '../../icons';
import { FIELD_CLASS } from '../../config';

type SelectVariant = 'outlined' | 'plain';

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  className?: string;
  variant?: SelectVariant;
}

const SELECT_CLASS: Record<SelectVariant, string> = {
  outlined: `pl-3 pr-8 ${FIELD_CLASS}`,
  plain:
    'field-sizing-content rounded bg-transparent py-0.5 pl-1 pr-5.5 focus-visible:outline-2 focus-visible:outline-primary-500',
};

const ICON_CLASS: Record<SelectVariant, string> = {
  outlined: 'right-2.5 w-4 h-4 text-fg-subtle',
  plain: 'right-0.5 w-3.5 h-3.5',
};

function Select({ variant = 'outlined', className = '', children, ...rest }: SelectProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select {...rest} className={`w-full h-full appearance-none ${SELECT_CLASS[variant]}`}>
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${ICON_CLASS[variant]}`}
      />
    </div>
  );
}

export default Select;
