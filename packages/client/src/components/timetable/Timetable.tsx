import Card from '@/components/common/Card.tsx';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';
import { timetableAPIDummies } from '@/utils/timetable/dummies.ts';
import { ScheduleTime, scheduleTimeAdapter } from '@/hooks/server/useTimetableData.ts';
import useWishes from '@/hooks/server/useWishes.ts';

function Timetable() {
  const { data: wishes } = useWishes();
  const timetable = scheduleTimeAdapter(timetableAPIDummies, wishes);
  const { scheduleTimes, colNames, rowNames } = timetable ?? { scheduleTimes: undefined };

  return (
    <Card>
      <TimetableGrid colNames={colNames} rowNames={rowNames}>
        <WeekTable colNames={colNames} scheduleTimes={scheduleTimes} />
      </TimetableGrid>
    </Card>
  );
}

function WeekTable({
  colNames = DEFAULT_DAY_NAMES,
  scheduleTimes,
}: Readonly<{ colNames?: string[]; scheduleTimes?: Record<string, ScheduleTime[]> }>) {
  if (!scheduleTimes) {
    return <div className="text-gray-500 text-center">시간표가 없습니다.</div>;
  }

  return colNames.map(dayName => (
    <DaySchedule key={'day-schedule-' + dayName} scheduleTimes={scheduleTimes[dayName]} />
  ));
}

interface ITimetableGridProps {
  colNames?: string[];
  rowNames?: string[];
  headerWidth?: number;
  rowHeight?: number;
  children?: React.ReactNode;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_DAY_NAMES = DAY_NAMES.slice(0, 5); // Default to weekdays
const DEFAULT_ROW_NAMES = Array.from({ length: 12 }, (_, i) => `${i + 9}`);
export const HEADER_WIDTH = 60;
export const ROW_HEIGHT = 40;

function TimetableGrid({
  colNames = DEFAULT_DAY_NAMES,
  rowNames = DEFAULT_ROW_NAMES,
  headerWidth = HEADER_WIDTH,
  rowHeight = ROW_HEIGHT,
  children,
}: Readonly<ITimetableGridProps>) {
  return (
    <div className="relative w-full">
      {/*header*/}
      <div className="flex bg-gray-50 rounded-t-md" style={{ height: `${rowHeight}px` }}>
        <div
          className="flex items-center justify-center font-semibold text-gray-700"
          style={{ width: `${headerWidth}px` }}
        />

        {colNames.map((name, i) => (
          <div
            key={'timetable-grid-header-' + i}
            className="flex flex-auto items-center justify-center font-semibold text-gray-400"
          >
            {name}
          </div>
        ))}
      </div>

      {/*col lines*/}
      <div className="flex absolute inset-0" style={{ top: `${rowHeight}px`, left: `${headerWidth}px` }}>
        {colNames.map((_, i) => (
          <div key={'timetable-grid-col-' + i} className="flex-auto border-l border-gray-200 h-full" />
        ))}
      </div>

      {/*row lines*/}
      <div>
        {rowNames.map((rowName, i) => (
          <div
            key={'timetable-grid-row-' + i}
            className="border-b border-gray-200"
            style={{ height: `${rowHeight}px` }} // 100% / 12 rows
          >
            <span
              className="flex items-center justify-center h-full text-gray-400"
              style={{ width: `${headerWidth}px` }}
            >
              {rowName}
            </span>
          </div>
        ))}
      </div>

      {/*children*/}
      <div className="absolute inset-0 flex z-10" style={{ top: `${rowHeight}px`, left: `${headerWidth}px` }}>
        {children}
      </div>
    </div>
  );
}

export default Timetable;
