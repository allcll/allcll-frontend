import ArrowIcon from '@/components/svgs/ArrowIcon';
import CancelIcon from '@/components/svgs/CancelIcon';
import { getSelectedColor } from '@/utils/colors';

interface IChip {
  label: string;
  selected?: boolean;
  chipType?: 'select' | 'cancle';
  onClick?: () => void;
}

function Chip({ label = 'Chip', selected = false, chipType, onClick, ...props }: IChip) {
  return (
    <button
      type="button"
      className={`items-center justify-center px-3 py-2 rounded-lg cursor-pointer text-sm gap-4 flex flex-row max-w-40 ${getSelectedColor(selected)} 
    focus:outline focus:outline-2 focus:outline-blue-400`}
      aria-pressed={selected}
      onClick={onClick}
      {...props}
    >
      <span className="text-xs sm:text-sm truncate">{label}</span>
      {chipType === 'select' && <ArrowIcon selected={selected} />}
      {chipType === 'cancle' && <CancelIcon selected={selected} />}
    </button>
  );
}

export default Chip;
