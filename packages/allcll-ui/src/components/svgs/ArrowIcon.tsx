import ArrowDownGraySvg from '@/assets/arrow-down-gray.svg?react';
import ArrowDownBlueSvg from '@/assets/arrow-down-blue.svg?react';

interface IArrowIcon {
  className?: string;
  selected?: boolean;
}

const ArrowIcon = ({ className, selected = false }: IArrowIcon) => {
  return selected ? <ArrowDownBlueSvg className={className} /> : <ArrowDownGraySvg className={className} />;
};

export default ArrowIcon;
