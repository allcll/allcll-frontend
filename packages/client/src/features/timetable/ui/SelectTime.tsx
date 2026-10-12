import { Day } from '@/entities/timetable/model/types.ts';
import { Select } from '@allcll/allcll-ui';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

interface ISelectTime {
  timeRange: TimeRange;
  onChange: (key: keyof TimeRange, value: string, day?: Day) => void;
  day?: Day;
}

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}`);
const MINUTES = ['00', '10', '20', '30', '40', '50'];

function SelectTime({ timeRange, onChange, day }: Readonly<ISelectTime>) {
  const handleChangeTime = (key: keyof TimeRange, value: string) => {
    if (day) {
      onChange(key, value, day);
      return;
    }

    onChange(key, value);
  };

  return (
    <div className=" w-full h-3 flex gap-2 flex-col justify-center">
      <div className="relative w-full flex gap-2 flex-wrap">
        <Select
          name="startHour"
          value={timeRange.startHour ?? HOURS[8]}
          onChange={e => handleChangeTime('startHour', e.target.value)}
        >
          {HOURS.map(hour => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </Select>
        <Select
          name="startMinute"
          value={timeRange.startMinute ?? MINUTES[0]}
          onChange={e => handleChangeTime('startMinute', e.target.value)}
        >
          {MINUTES.map(minute => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </Select>

        <span className="text-gray-400 text-sm mx-1">~</span>

        <Select
          name="endHour"
          value={timeRange.endHour ?? HOURS[9]}
          onChange={e => handleChangeTime('endHour', e.target.value)}
        >
          {HOURS.map(hour => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </Select>
        <Select
          name="endMinute"
          value={timeRange.endMinute ?? MINUTES[0]}
          onChange={e => handleChangeTime('endMinute', e.target.value)}
        >
          {MINUTES.map(minute => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default SelectTime;
