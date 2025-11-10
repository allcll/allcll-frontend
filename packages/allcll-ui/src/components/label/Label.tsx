import type { ComponentPropsWithoutRef } from 'react';

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean;
}

const Label = ({ id, required = false, children, ...rest }: LabelProps) => (
  <label
    htmlFor={id}
    className={`text-xs  text-gray-400 after:ml-0.5 ${required ? 'after:content-["*"] after:text-red-500' : ''}`}
    {...rest}
  >
    {children}
  </label>
);

export default Label;
