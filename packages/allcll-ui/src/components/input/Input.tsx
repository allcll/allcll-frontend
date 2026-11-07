import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { FIELD_CLASS } from '../../config';

interface IInput extends ComponentPropsWithoutRef<'input'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInput>(function Input(
  { className = '', leftIcon, rightIcon, fullWidth = true, ...rest },
  ref,
) {
  const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

  return (
    <div className={`relative items-center ${fullWidth ? 'flex w-full' : 'inline-flex'}`}>
      {leftIcon && <div className="absolute inset-y-0 left-3 flex items-center">{leftIcon}</div>}

      <input ref={ref} type="text" className={`${FIELD_CLASS} ${paddingLeft} ${paddingRight} ${className}`} {...rest} />

      {rightIcon && <div className="absolute inset-y-0 right-3 flex items-center">{rightIcon}</div>}
    </div>
  );
});

export default Input;
