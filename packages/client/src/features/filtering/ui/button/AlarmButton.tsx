import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';
import { Filters } from '@/features/filtering/model/useFilterStore.ts';
import { Button } from '@allcll/allcll-ui';

interface IAlarmButton {
  alarmOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function AlarmButton({ alarmOnly, setFilter }: IAlarmButton) {
  return (
    <Button variant="outlined" size="medium" onClick={() => setFilter('alarmOnly', !alarmOnly)}>
      <AlarmIcon disabled={!alarmOnly} />
      알림과목
    </Button>
  );
}

export default AlarmButton;
