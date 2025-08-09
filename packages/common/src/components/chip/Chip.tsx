/**
 * TODO: admin과 client에서 공통으로 사용하는 컴포넌트는 packages/common 위치시켜야 합니다.
 */
import ArrowIcon from '@/components/svgs/ArrowIcon';
import CancelIcon from '@/components/svgs/CancleIcon';
import { ButtonHTMLAttributes, ReactNode, RefObject } from 'react';

function getSelectedColor(selected: boolean) {
  return selected
    ? 'bg-blue-100 text-blue-500 focus:outline-blue-500'
    : 'bg-gray-100 text-gray-700 focus:outline-gray-400';
}

interface IChip extends ButtonHTMLAttributes<HTMLButtonElement> {
  containerRef?: RefObject<HTMLButtonElement | null>;
  label: string | ReactNode;
  selected: boolean;
  chipType?: 'select' | 'cancel';
  onClick?: () => void;
}

function Chip({ label = 'Chip', selected, chipType, containerRef, onClick, ...props }: Readonly<IChip>) {
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
