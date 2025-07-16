import Card from '@/components/common/Card.tsx';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';

function Timetable() {
  return (
    <Card>
      <TimetableGrid>
        <WeekTable />
      </TimetableGrid>
    </Card>
  );
}

function WeekTable() {
  const COL = 5; // Number of columns (days of the week)
  return Array.from({ length: COL }).map((_, i) => <DaySchedule key={'day-schedule-' + i} />);
}

interface ITimetableGridProps {
  colNames?: string[];
  rowNames?: string[];
  headerWidth?: number;
  rowWidth?: number;
  children?: React.ReactNode;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_DAY_NAMES = DAY_NAMES.slice(0, 5); // Default to weekdays
const DEFAULT_ROW_NAMES = Array.from({ length: 12 }, (_, i) => `${i + 9}`);

function TimetableGrid({
  colNames = DEFAULT_DAY_NAMES,
  rowNames = DEFAULT_ROW_NAMES,
  headerWidth = 60,
  rowWidth = 40,
  children,
}: Readonly<ITimetableGridProps>) {
  return (
    <div className="relative w-full">
      {/*header*/}
      <div className="flex bg-gray-50 rounded-t-md" style={{ height: `${rowWidth}px` }}>
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
      <div className="flex absolute inset-0" style={{ top: `${rowWidth}px`, left: `${headerWidth}px` }}>
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
            style={{ height: `${rowWidth}px` }} // 100% / 12 rows
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
      <div className="absolute inset-0 flex z-10" style={{ top: `${rowWidth}px`, left: `${headerWidth}px` }}>
        {children}
      </div>
    </div>
  );
}

export default Timetable;
