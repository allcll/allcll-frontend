import AlarmSvg from '@/assets/alarm.svg?react';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const AlarmIcon = ({ className, disabled = false }: IconProps) => {
  const style = disabled ? 'text-gray-400 ' : 'text-blue-500 ';
  return <AlarmSvg className={style + className} />;
};

export default AlarmIcon;
