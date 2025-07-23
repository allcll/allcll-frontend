import Schedule from '@/components/timetable/Schedule.tsx';
import { DayNameType, ScheduleTime } from '@/hooks/server/useTimetableData.ts';
import WireSchedules from '@/components/timetable/WireSchedules.tsx';
// import { useMutateScheduleState } from '@/store/useMutateScheduleState.ts';

interface IDayScheduleProps {
  dayOfWeek: DayNameType;
  scheduleTimes: ScheduleTime[];
}

function DaySchedule({ dayOfWeek, scheduleTimes }: Readonly<IDayScheduleProps>) {
  const Timeslots = scheduleTimes;
  // const timetableId = useMutateScheduleState(state => state.timetableId);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log(e.currentTarget);
    // Todo: Open modal to create a new schedule
  };

  return (
    <div
      className="relative flex-auto px-[2px]"
      onClick={onClick}
      // onMouseDown={onMouseDown}
      // onMouseMove={onMouseMove}
      // onMouseUp={onMouseUp}
    >
      <WireSchedules dayOfWeek={dayOfWeek} />
      {Timeslots.map(({ title, professor, location, color, width, height, top }, index) => (
        <Schedule
          key={'schedule-' + index}
          title={title}
          professor={professor ?? ''}
          location={location ?? ''}
          color={color}
          style={{ height, top, width }}
        />
      ))}
    </div>
  );
}

export default DaySchedule;
