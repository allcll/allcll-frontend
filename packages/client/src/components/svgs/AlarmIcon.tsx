import AlarmGray from '@/assets/alarm-gray.svg?react';
import AlarmBlue from '@/assets/alarm-blue.svg?react';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const AlarmIcon = ({ className, disabled=false }: IconProps) => {
  return disabled ? (
    <AlarmGray className={className}/>
  ) : (
    <AlarmBlue className={className}/>
  );
};

export default AlarmIcon;