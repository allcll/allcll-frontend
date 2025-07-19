import ArrowIcon from '@/components/svgs/ArrowIcon';
import CancelIcon from '@/components/svgs/CancelIcon';
import { getSelectedColor } from '@/utils/colors';

interface IChip {
  label: string;
  selected: boolean;
  type?: 'select' | 'cancle';
  onClick?: () => void;
}

function Chip({ label = 'Chip', selected = true, type = 'select', onClick, ...props }: IChip) {
  return (
    <button
      type="button"
      className={`items-center justify-center px-3 py-2 rounded-lg cursor-pointer text-sm gap-4 flex flex-row max-w-40 ${getSelectedColor(selected)} 
        focus:outline focus:outline-2`}
      onClick={onClick}
      {...props}
    >
      <span>{label}</span>
      {type === 'select' ? <ArrowIcon selected={selected} /> : <CancelIcon selected={selected} />}
    </button>
  );
}

export default Chip;
