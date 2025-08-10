import CancleGraySvg from '@/assets/x-gray.svg?react';
import CancleBlueSvg from '@/assets/x-blue.svg?react';

interface ICancleIcon {
  className?: string;
  selected?: boolean;
}
const CancleIcon = ({ className, selected = false }: ICancleIcon) => {
  return selected ? <CancleBlueSvg className={className} /> : <CancleGraySvg className={className} />;
};

export default CancleIcon;
