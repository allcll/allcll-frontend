import ArrowDownGraySvg from '@/assets/arrow-down.svg?react';
import ArrowDownBlueSvg from '@/assets/arrow-down.svg?react';

interface IArrowIcon {
  className?: string;
  selected?: boolean;
}

const ArrowIcon = ({ className, selected = false }: IArrowIcon) => {
  const finalClassName = selected ? className + ' text-blue-500' : className + ' text-gray-400';

  return selected ? <ArrowDownBlueSvg className={finalClassName} /> : <ArrowDownGraySvg className={finalClassName} />;
};

export default ArrowIcon;
