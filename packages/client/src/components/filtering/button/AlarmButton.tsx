import AlarmIcon from '@/components/svgs/AlarmIcon';
import { Filters } from '@/store/useFilterStore';

interface IAlarmButton {
  alarmOnly: boolean;
  setFilter: (key: keyof Filters, value: boolean) => void;
}

function AlarmButton({ alarmOnly, setFilter }: IAlarmButton) {
  return (
    <button
      className="px-4 py-2 rounded-md flex gap-2 items-center text-nowrap border border-gray-400 hover:bg-white cursor-pointer"
      onClick={() => setFilter('alarmOnly', !alarmOnly)}
    >
      <AlarmIcon disabled={!alarmOnly} />
      알림과목
    </button>
  );
}

export default AlarmButton;
