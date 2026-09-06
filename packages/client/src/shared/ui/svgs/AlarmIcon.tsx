import { NotificationFilledIcon } from '@allcll/allcll-ui';

interface IconProps {
  className?: string;
  disabled?: boolean;
}
const AlarmIcon = ({ className, disabled = false }: IconProps) => {
  const style = disabled ? 'text-gray-400 ' : 'text-blue-500 ';
  return <NotificationFilledIcon className={style + className} />;
};

export default AlarmIcon;
