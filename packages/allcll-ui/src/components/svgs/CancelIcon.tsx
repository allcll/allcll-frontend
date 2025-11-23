import CancelGraySvg from '@/assets/x.svg?react';
import CancelBlueSvg from '@/assets/x.svg?react';

interface ICancelIcon {
  className?: string;
  selected?: boolean;
}

const CancelIcon = ({ className, selected = false }: ICancelIcon) => {
  const finalClassName = selected ? className + ' text-blue-500' : className + ' text-gray-400';

  return selected ? <CancelBlueSvg className={finalClassName} /> : <CancelGraySvg className={finalClassName} />;
};

export default CancelIcon;
