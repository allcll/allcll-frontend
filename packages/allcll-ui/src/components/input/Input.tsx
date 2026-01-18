import { useRef, type ComponentPropsWithoutRef } from 'react';

interface IInput extends ComponentPropsWithoutRef<'input'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ className = '', leftIcon, rightIcon, ...rest }: IInput) {
  const ref = useRef<HTMLInputElement | null>(null);

  const paddingLeft = leftIcon ? 'pl-10' : 'pl-3';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-3';

  return (
    <div className="relative flex items-center w-full">
      {leftIcon && <div>{leftIcon}</div>}

      <input
        ref={ref}
        type="text"
        className={`py-2 border rounded-md border-gray-400 py-2 px-3 focus:outline-none focus:ring-0 focus:border-primary-500 ${paddingLeft} ${paddingRight} ${className}`}
        {...rest}
      />

      {rightIcon && <div>{rightIcon}</div>}
    </div>
  );
}

export default Input;
