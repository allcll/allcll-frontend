import { InputHTMLAttributes } from 'react';
import EssentialTag from './EssentialTag.tsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  essential?: boolean;
}

function Input({ type = 'text', className = '', essential = false, disabled = false, ...rest }: InputProps) {
  const fixedClassName =
    'relative border-1 border-gray-300 px-2 text-xs w-max h-6 ' +
    'focus:outline-none focus:rounded focus:ring focus:border-gray-800 ' +
    'disabled:bg-gray-100 disabled:cursor-not-allowed ';

  return (
    <EssentialTag className={className} essential={essential} disabled={disabled}>
      <input type={type} className={fixedClassName} disabled={disabled} {...rest} />
    </EssentialTag>
  );
}

export default Input;
