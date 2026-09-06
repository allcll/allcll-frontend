import { NotificationFilledIcon } from '../../icons';

interface IconProps {
  className?: string;
  disabled?: boolean;
}

const AlarmIcon = ({ className, disabled = false }: IconProps) => (
  <NotificationFilledIcon className={`${className ?? ''} ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
);

export default AlarmIcon;
