import type { ComponentPropsWithoutRef, RefObject } from 'react';
import ArrowIcon from '../svgs/ArrowIcon';
import CancelIcon from '../svgs/CancelIcon';
import type React from 'react';

type ChipVariantType = 'select' | 'cancel' | 'none';

interface IChip extends ComponentPropsWithoutRef<'button'> {
  containerRef?: RefObject<HTMLButtonElement | null>;
  /**Chip의 텍스트 */
  label: string | React.ReactElement;
  /**Chip이 선택되었는지 여부 */
  selected: boolean;
  /**Chip의 종류 */
  variant?: ChipVariantType;
  /**Chip이 열려있는지 여부 */
  isChipOpen?: boolean;
}

function Chip({
  label = 'Chip',
  selected,
  variant = 'none',
  containerRef,
  onClick,
  isChipOpen,
  ...rest
}: Readonly<IChip>) {
  const baseClasses =
    'flex flex-row justify-center items-center cursor-pointer gap-4 transition-colors duration-300 ease-out active:scale-[0.97]';

  return (
    <button
      type="button"
      ref={containerRef}
      className={`${baseClasses} ${getTypeRoundedClass(variant)} ${getColorClass(selected, variant)}`}
      aria-pressed={selected}
      onClick={onClick}
      {...rest}
    >
      <span className="text-xs sm:text-sm">{label}</span>

      {variant === 'select' && (
        <ArrowIcon
          aria-hidden="true"
          selected={selected}
          className={`w-5 h-5 pointer-events-none transition-transform text-blue-500 duration-200 ${isChipOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      )}

      {variant === 'cancel' && (
        <CancelIcon aria-hidden="true" selected={selected} className="pointer-events-none w-4 h-4" />
      )}
    </button>
  );
}

/**Chip 컴포넌트의 기본 레이아웃은 그리드입니다. */
Chip.layout = 'grid' as const;

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
