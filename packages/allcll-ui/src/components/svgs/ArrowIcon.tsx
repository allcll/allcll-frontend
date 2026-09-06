import { ChevronDownIcon } from '../../icons';

interface IArrowIcon {
  className?: string;
  selected?: boolean;
}

const ArrowIcon = ({ className, selected = false }: IArrowIcon) => (
  <ChevronDownIcon className={`${className ?? ''} ${selected ? 'text-blue-500' : 'text-gray-400'}`} />
);

export default ArrowIcon;
