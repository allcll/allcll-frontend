import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { ChevronDownIcon, CloseIcon } from '../../icons';
import type React from 'react';

type ChipVariantType = 'select' | 'cancel' | 'fill' | 'none';

interface IChip extends ComponentPropsWithoutRef<'button'> {
  /**Chip의 텍스트 */
  label: string | React.ReactElement;
  /**Chip이 선택되었는지 여부 */
  selected: boolean;
  /**Chip의 종류 */
  variant?: ChipVariantType;
  /**Chip이 열려있는지 여부 */
  isChipOpen?: boolean;
}

const ChipBase = forwardRef<HTMLButtonElement, Readonly<IChip>>(function Chip(
  { label = 'Chip', selected, variant = 'none', onClick, isChipOpen, ...rest },
  ref,
) {
  const baseClasses =
    'flex flex-row justify-center items-center gap-4 transition-colors duration-300 ease-out not-disabled:active:scale-[0.97]';

  return (
    <button
      type="button"
      ref={ref}
      className={`${baseClasses} ${getTypeRoundedClass(variant)} ${getColorClass(selected, variant)}`}
      aria-pressed={selected}
      onClick={onClick}
      {...rest}
    >
      <span className="text-sm">{label}</span>

      {variant === 'select' && (
        <ChevronDownIcon
          aria-hidden="true"
          className={`w-5 h-5 pointer-events-none transition-transform duration-200 ${selected ? 'text-primary-500' : 'text-gray-400'} ${isChipOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      )}

      {variant === 'cancel' && (
        <CloseIcon
          aria-hidden="true"
          className={`pointer-events-none w-4 h-4 ${selected ? 'text-primary-500' : 'text-gray-400'}`}
        />
      )}
    </button>
  );
});

/**Chip 컴포넌트의 기본 레이아웃은 그리드입니다. */
const Chip = Object.assign(ChipBase, { layout: 'grid' as const });

export default Chip;

function getColorClass(selected: boolean, variant: ChipVariantType) {
  if (selected) {
    return `
      bg-primary-100
      text-primary-500
      hover:bg-primary-200
      focus:outline-primary-500
    `;
  }

  if (variant === 'none') {
    return `
      bg-transparent
      text-gray-700
      border border-gray-200
      hover:bg-gray-100
      focus:outline-gray-400
    `;
  }

  return `
    bg-gray-100
    text-gray-700
    hover:bg-gray-200
    focus:outline-gray-400
  `;
}

function getTypeRoundedClass(variant: ChipVariantType) {
  if (variant === 'cancel') {
    return 'rounded-full text-xs py-1.5 px-4';
  }
  return 'rounded-lg text-sm py-2 px-4';
}
