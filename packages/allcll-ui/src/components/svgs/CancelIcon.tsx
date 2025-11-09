import CancelGraySvg from '@/assets/x-gray.svg?react';
import CancelBlueSvg from '@/assets/x-blue.svg?react';

interface ICancelIcon {
  className?: string;
  selected?: boolean;
}

const CancelIcon = ({ className, selected = false }: ICancelIcon) => {
  return selected ? <CancelBlueSvg className={className} /> : <CancelGraySvg className={className} />;
};

export default CancelIcon;
