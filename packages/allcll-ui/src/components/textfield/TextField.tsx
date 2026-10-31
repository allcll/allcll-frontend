import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Label from '../label/Label';
import Flex from '../flex/Flex';
import IconButton from '../icon-button/IconButton';
import { CloseIcon } from '../../icons';
import { FIELD_BOX_CLASS, FIELD_TEXT_CLASS } from '../../config';

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  size: 'small' | 'medium' | 'large';
  className?: string;
  onClear?: () => void;
  endAdornment?: ReactNode;
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
  endAdornment,
  ...rest
}: TextFieldProps) {
  const paddingRight = onClear && endAdornment ? 'pr-14' : onClear || endAdornment ? 'pr-8' : 'pr-3';

  return (
    <Flex direction="flex-col" gap="gap-1.5" className={className}>
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
          className={`w-full pl-3 ${paddingRight} ${FIELD_BOX_CLASS} ${getSizeClass(size)}`}
        />
        {onClear && value && (
          <IconButton
            aria-label="입력 내용 지우기"
            icon={<CloseIcon className="w-4 h-4" />}
            onClick={onClear}
            className=" absolute right-2 top-1/2 transform -translate-y-1/2 "
          />
        )}
        {endAdornment && (
          <div className={`absolute ${onClear ? 'right-8' : 'right-2'} top-1/2 -translate-y-1/2 flex`}>
            {endAdornment}
          </div>
        )}
      </div>

      {isError && <span className="text-danger-500 text-xs">{errorMessage}</span>}
    </Flex>
  );
}

export default TextField;

function getSizeClass(size: string) {
  switch (size) {
    case 'small':
      return 'text-sm';
    case 'large':
      return 'text-lg';
    case 'medium':
    default:
      return FIELD_TEXT_CLASS;
  }
}
