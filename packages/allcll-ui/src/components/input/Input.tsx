import { useRef, type ComponentPropsWithoutRef } from 'react';
import { FIELD_CLASS } from '../../config';

interface IInput extends ComponentPropsWithoutRef<'input'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Input({ className = '', leftIcon, rightIcon, fullWidth = true, ...rest }: IInput) {
  const ref = useRef<HTMLInputElement | null>(null);

  const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

  return (
    <div className={`relative items-center ${fullWidth ? 'flex w-full' : 'inline-flex'}`}>
      {leftIcon && <div>{leftIcon}</div>}

      <input ref={ref} type="text" className={`${FIELD_CLASS} ${paddingLeft} ${paddingRight} ${className}`} {...rest} />

      {rightIcon && <div>{rightIcon}</div>}
    </div>
  );
}

export default Input;
