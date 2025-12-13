import type { ComponentPropsWithoutRef } from 'react';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean;
  className?: string;
}

const Label = ({ id, required, children, className = '', ...rest }: LabelProps) => {
  const baseClass = `text-xs sm:text-sm text-gray-800 after:ml-0.5 ${required ? 'after:content-["*"] after:text-red-500' : ''}`;

  return (
    <label htmlFor={id} className={`${baseClass} ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;
