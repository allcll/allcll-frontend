import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Button, NotificationFilledIcon, NotificationIcon } from '@allcll/allcll-ui';

interface IAlarmButton {
  alarmOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function AlarmButton({ alarmOnly, setFilter }: IAlarmButton) {
  return (
    <Button variant="outlined" size="medium" onClick={() => setFilter('alarmOnly', !alarmOnly)}>
      {alarmOnly ? (
        <NotificationFilledIcon className="w-4 h-4 text-blue-500" />
      ) : (
        <NotificationIcon className="w-4 h-4 text-gray-400" />
      )}
      알림과목
    </Button>
  );
}

export default AlarmButton;
