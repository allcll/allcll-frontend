import { Day } from '@/utils/types';

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

const HOURS = ['9시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시'];
const MINUTES = ['0분', '10분', '20분', '30분', '40분', '50분'];

function SelectTime({ timeRange, onChange, day }: ISelectTime) {
  const handleChangeTime = (key: keyof TimeRange, value: string) => {
    if (day) {
      onChange(key, value, day);
      return;
    }

    onChange(key, value);
  };

  return (
    <div className=" w-full h-15 flex gap-2 flex flex-col justify-center">
      <label className="text-xs text-gray-400">시간</label>
      <div className="relative w-full flex gap-2 flex-wrap">
        <select
          name="startHour"
          value={timeRange.startHour ?? HOURS[0]}
          onChange={e => handleChangeTime('startHour', e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
        >
          {HOURS.map(hour => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <select
          name="startMinute"
          value={timeRange.startMinute ?? MINUTES[0]}
          onChange={e => handleChangeTime('startMinute', e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
        >
          {MINUTES.map(minute => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>

        <span className="text-gray-400 text-sm mx-1">~</span>

        <select
          name="endHour"
          value={timeRange.endHour ?? HOURS[0]}
          onChange={e => handleChangeTime('endHour', e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
        >
          {HOURS.map(hour => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <select
          name="endMinute"
          value={timeRange.endMinute ?? MINUTES[0]}
          onChange={e => handleChangeTime('endMinute', e.target.value)}
          className="bg-gray-100 px-3 py-2 rounded-md text-xs text-gray-600 w-fit"
        >
          {MINUTES.map(minute => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectTime;
