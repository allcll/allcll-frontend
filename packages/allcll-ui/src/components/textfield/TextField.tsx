import type { ComponentPropsWithoutRef } from 'react';
import Label from '../label/Label';
import Flex from '../flex/Flex';
import IconButton from '../icon-button/IconButton';
import XSvg from '@/assets/x.svg?react';

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  size: 'small' | 'medium' | 'large';
  className?: string;
  onClear?: () => void;
}

function TextField({
  label,
  isError,
  errorMessage,
  required,
  id,
  size = 'medium',
  className = '',
  value,
  onClear,
  ...rest
}: TextFieldProps) {
  return (
    <Flex direction="flex-col" gap="gap-2" className={className}>
      {label && (
        <Label required={required} id={id}>
          {label}
        </Label>
      )}

      <div className="relative w-full ">
        <input
          id={id}
          type="text"
          aria-invalid={isError}
          required={required}
          value={value}
          {...rest}
          className={`rounded-md w-full bg-white border border-gray-300 py-2 px-3 focus:outline-none focus:ring-0 focus:border-primary-500 ${onClear ? 'pr-8' : ''} ${getSizeClass(size)}`}
        />
        {onClear && value && (
          <IconButton
            aria-label="입력 내용 지우기"
            icon={<XSvg className="w-4 h-4" />}
            onClick={onClear}
            className=" absolute right-2 top-1/2 transform -translate-y-1/2 "
          />
        )}
      </div>

      {isError && <span className="text-secondary-500 text-xs">{errorMessage}</span>}
    </Flex>
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
