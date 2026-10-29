import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Chip, Flex, NotificationFilledIcon, NotificationIcon } from '@allcll/allcll-ui';

interface IAlarmButton {
  alarmOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function AlarmButton({ alarmOnly, setFilter }: IAlarmButton) {
  return (
    <Chip
      variant="fill"
      selected={alarmOnly}
      onClick={() => setFilter('alarmOnly', !alarmOnly)}
      label={
        <Flex align="items-center" gap="gap-1">
          {alarmOnly ? <NotificationFilledIcon className="w-4 h-4" /> : <NotificationIcon className="w-4 h-4" />}
          알림과목
        </Flex>
      }
    />
  );
}

export default AlarmButton;
