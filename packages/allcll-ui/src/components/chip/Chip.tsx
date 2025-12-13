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
  return (
    <button
      type="button"
      ref={containerRef}
      className={`flex flex-row justify-between items-center px-4 py-2 rounded-lg cursor-pointer gap-4 ${getSelectedColor(selected)}`}
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
        <CancelIcon aria-hidden="true" selected={selected} className="pointer-events-none w-5 h-5" />
      )}
    </button>
  );
}

export default Chip;

function getSelectedColor(selected: boolean) {
  return selected
    ? `bg-blue-100 text-blue-500 focus:outline-blue-500 hover:bg-blue-200`
    : `bg-gray-100 text-gray-700 focus:outline-gray-400 hover:bg-gray-200`;
}
