import type { ComponentPropsWithoutRef } from 'react';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean;
  className?: string;
}

const Label = ({ required, children, className = '', ...rest }: LabelProps) => {
  const baseClass = `text-sm text-fg-secondary after:ml-0.5 ${required ? 'after:content-["*"] after:text-danger-500' : ''}`;

  return (
    <label className={`${baseClass} ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;
