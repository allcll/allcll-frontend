import { ButtonHTMLAttributes, ReactNode, RefObject } from 'react';
import ArrowIcon from '../svgs/ArrowIcon';
import CancleIcon from '../svgs/CancleIcon';

function getSelectedColor(selected: boolean) {
  return selected
    ? `bg-blue-100 text-blue-500 focus:outline-blue-500 hover:bg-blue-200`
    : `bg-gray-100 text-gray-700 focus:outline-gray-400 hover:bg-gray-200`;
}

interface IChip extends ButtonHTMLAttributes<HTMLButtonElement> {
  containerRef?: RefObject<HTMLButtonElement | null>;
  label: string | ReactNode;
  selected: boolean;
  isChipOpen?: boolean;
  chipType?: 'select' | 'cancel';
  onClick?: () => void;
}

function Chip({ label = 'Chip', selected, chipType, containerRef, onClick, isChipOpen, ...props }: Readonly<IChip>) {
  return (
    <button
      type="button"
      ref={containerRef}
      className={`items-center justify-center px-3 py-2 rounded-lg cursor-pointer text-sm gap-4 flex flex-row ${getSelectedColor(selected)} 
     `}
      aria-pressed={selected}
      onClick={onClick}
      {...props}
    >
      <span className="text-xs sm:text-sm truncate">{label}</span>
      {chipType === 'select' && (
        <ArrowIcon
          selected={selected}
          className={`w-4 h-4 pointer-events-none transition-transform duration-200
    ${isChipOpen ? 'rotate-180' : 'rotate-0'}
  `}
        />
      )}

      {chipType === 'cancel' && <CancleIcon selected={selected} className="pointer-events-none" />}
    </button>
  );
}

export default Chip;
