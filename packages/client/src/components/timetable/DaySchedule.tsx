import Schedule from '@/components/timetable/Schedule.tsx';
import { ScheduleTime } from '@/hooks/server/useTimetableData.ts';
import WireSchedules from '@/components/timetable/WireSchedules.tsx';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';
import { Day } from '@/utils/types.ts';
import useScheduleModal from '@/hooks/useScheduleModal.ts';

interface IDayScheduleProps {
  dayOfWeek: Day;
  scheduleTimes: ScheduleTime[];
}

function DaySchedule({ dayOfWeek, scheduleTimes }: Readonly<IDayScheduleProps>) {
  const Timeslots = scheduleTimes;
  const { openScheduleModal } = useScheduleModal();

  const { onMouseDown } = useScheduleDrag(
    () => {},
    () => {},
  );

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log(e.relatedTarget);
    // Todo: Open modal to create a new schedule

    openScheduleModal({
      scheduleId: 0,
      scheduleType: 'custom',
      subjectId: null,
      subjectName: '',
      professorName: '',
      location: '',
      timeslots: [],
    });
  };

  return (
    <div
      className="relative flex-auto px-[2px]"
      onClick={onClick}
      onMouseDown={onMouseDown}
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
