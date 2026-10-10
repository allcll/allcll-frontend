import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDownIcon } from '../../icons';

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  size?: 'small' | 'medium';
  className?: string;
}

function Select({ size = 'medium', className = '', children, ...rest }: SelectProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        {...rest}
        className={`w-full appearance-none rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400 ${getSizeClass(size)}`}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 ${getIconClass(size)}`}
      />
    </div>
  );
}

export default Select;

function getSizeClass(size: string) {
  switch (size) {
    case 'small':
      return 'text-xs py-1.5 pl-2.5 pr-7';
    case 'medium':
    default:
      return 'text-sm py-2 pl-3 pr-8';
  }
}

function getIconClass(size: string) {
  switch (size) {
    case 'small':
      return 'right-2 w-3.5 h-3.5';
    case 'medium':
    default:
      return 'right-2.5 w-4 h-4';
  }
}
