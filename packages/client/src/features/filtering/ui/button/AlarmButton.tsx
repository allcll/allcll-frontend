import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Button, NotificationFilledIcon } from '@allcll/allcll-ui';

interface IAlarmButton {
  alarmOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function AlarmButton({ alarmOnly, setFilter }: IAlarmButton) {
  return (
    <Button variant="outlined" size="medium" onClick={() => setFilter('alarmOnly', !alarmOnly)}>
      <NotificationFilledIcon className={alarmOnly ? 'text-blue-500' : 'text-gray-400'} />
      알림과목
    </Button>
  );
}

export default AlarmButton;
