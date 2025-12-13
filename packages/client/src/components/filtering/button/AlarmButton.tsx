import AlarmIcon from '@/components/svgs/AlarmIcon';
import { Filters } from '@/store/useFilterStore';
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
