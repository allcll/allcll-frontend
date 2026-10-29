import type { ComponentPropsWithoutRef } from 'react';
import { useIsInPopoverContent } from '../popover/popover-content/PopoverContentContext';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean;
  className?: string;
}

const Label = ({ id, required, children, className = '', ...rest }: LabelProps) => {
  const isInPopover = useIsInPopoverContent();
  const sizeClass = isInPopover ? 'text-xs font-medium text-gray-500' : 'text-sm sm:text-base text-text-200';
  const baseClass = `${sizeClass} after:ml-0.5 ${required ? 'after:content-["*"] after:text-danger-500' : ''}`;

  return (
    <label htmlFor={id} className={`${baseClass} ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;
