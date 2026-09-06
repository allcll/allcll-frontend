import { CloseIcon } from '../../icons';

interface ICancelIcon {
  className?: string;
  selected?: boolean;
}

const CancelIcon = ({ className, selected = false }: ICancelIcon) => (
  <CloseIcon className={`${className ?? ''} ${selected ? 'text-blue-500' : 'text-gray-400'}`} />
);

export default CancelIcon;
