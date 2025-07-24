import ArrowIcon from '@/components/svgs/ArrowIcon';
import CancelIcon from '@/components/svgs/CancelIcon';
import { getSelectedColor } from '@/utils/colors';
import { ButtonHTMLAttributes, RefObject } from 'react';

interface IChip extends ButtonHTMLAttributes<HTMLButtonElement> {
  containerRef?: RefObject<HTMLButtonElement> | null;
  label: string;
  selected: boolean;
  chipType?: 'select' | 'cancel';
  onClick?: () => void;
}

function Chip({ label = 'Chip', selected, chipType, containerRef, onClick, ...props }: IChip) {
  return (
    <button
      type="button"
      ref={containerRef}
      className={`items-center justify-center px-3 py-2 rounded-lg cursor-pointer text-sm gap-4 flex flex-row max-w-40 ${getSelectedColor(selected)} 
     `}
      aria-pressed={selected}
      onClick={onClick}
      {...props}
    >
      <span className="text-xs sm:text-sm truncate">{label}</span>
      {chipType === 'select' && <ArrowIcon selected={selected} className="w-4 h-4 pointer-events-none" />}
      {chipType === 'cancel' && <CancelIcon selected={selected} className="w-4 h-4 pointer-events-none" />}
    </button>
  );
}

export default Chip;
