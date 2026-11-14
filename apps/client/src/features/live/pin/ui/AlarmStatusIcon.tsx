import { NotificationFilledIcon, NotificationOffIcon } from '@allcll/allcll-ui';

function AlarmStatusIcon({ isAlarm }: Readonly<{ isAlarm: boolean }>) {
  return isAlarm ? (
    <NotificationFilledIcon className="text-primary-500" />
  ) : (
    <NotificationOffIcon className="text-fg-subtle" />
  );
}

export default AlarmStatusIcon;
