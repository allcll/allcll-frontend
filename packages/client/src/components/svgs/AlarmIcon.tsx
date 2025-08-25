import AlarmSvg from '@/assets/alarm.svg?react';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const AlarmIcon = ({ className, disabled = false }: IconProps) => {
  return disabled ? (
    <AlarmSvg className={'text-gray-400 ' + className} />
  ) : (
    <AlarmSvg className={'text-blue-500 ' + className} />
  );
};

export default AlarmIcon;
