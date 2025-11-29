import AlarmGray from '@/assets/bell-filled.svg?react';
import AlarmBlue from '@/assets/bell-filled.svg?react';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const AlarmIcon = ({ className, disabled = false }: IconProps) => {
  const finalClassName = disabled ? className + ' text-gray-400' : className + ' text-blue-500';

  return disabled ? <AlarmGray className={finalClassName} /> : <AlarmBlue className={finalClassName} />;
};

export default AlarmIcon;
