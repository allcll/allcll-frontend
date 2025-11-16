import type { ComponentPropsWithoutRef } from 'react';
import Label from '../label/Label';

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  size: 'small' | 'medium' | 'large';
}

function TextField({ label, isError, errorMessage, required, id, size = 'medium', ...rest }: TextFieldProps) {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <Label required={required} id={id}>
          {label}
        </Label>
      )}

      <input
        id={id}
        type="text"
        aria-invalid={isError}
        required={required}
        {...rest}
        className={`rounded-md w-full bg-white border border-gray-300 py-2 px-3 focus:outline-none focus:ring-0 focus:border-primary-500 ${getSizeClass(size)}`}
      />

      {isError && <span className="text-secondary-500 text-xs">{errorMessage}</span>}
    </div>
  );
}

export default TextField;

function getSizeClass(size: string) {
  switch (size) {
    case 'small':
      return 'text-sm py-1';
    case 'medium':
      return 'text-base py-1';
    case 'large':
      return 'text-lg py-1';
    default:
      return '';
  }
}
