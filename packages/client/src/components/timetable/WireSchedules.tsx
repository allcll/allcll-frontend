import { HTMLAttributes } from 'react';
import useSubject from '@/hooks/server/useSubject.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { IScheduleProps } from '@/components/timetable/Schedule.tsx';
import { Day } from '@/utils/types.ts';
import { ScheduleAdapter, TimeslotAdapter } from '@/utils/timetable/adapter.ts';

interface IWireSchedulesProps extends HTMLAttributes<HTMLDivElement> {
  dayOfWeeks: Day;
}

function WireSchedules({ dayOfWeeks }: Readonly<IWireSchedulesProps>) {
  const { schedule, options } = useScheduleState();
  const { data: subjects } = useSubject();

  if (!subjects || schedule.scheduleId > 0 || !schedule.timeSlots || schedule.timeSlots.length <= 0) return null;

  let minTime = parseInt(options.rowNames[0].replace('시', ''));
  if (Number.isNaN(minTime)) minTime = 9;

  // Fixme: schedule 형태 통일
  const newSchedule = new ScheduleAdapter(schedule, subjects).toUiData();
  const timeSlots = new TimeslotAdapter(newSchedule.timeSlots).toUiData(minTime);
  const scheduleTime = timeSlots.filter(({ dayOfWeek: day }) => day === dayOfWeeks);

  if (!scheduleTime) return null;

  const { subjectName, professorName, location } = newSchedule;

  return scheduleTime.map(({ height, top, left, right }, index) => (
    <WireSchedule
      key={`wire-schedule-${dayOfWeeks}-${index}`}
      timeslotIndex={index}
      title={subjectName ?? ''}
      professor={professorName ?? ''}
      location={location ?? ''}
      schedule={schedule}
      style={{ height, top, left, right }}
    />
  ));
}

function WireSchedule({ title, professor, location, ...attrs }: Readonly<IScheduleProps>) {
  const { timeslotIndex: _, ...rest } = attrs;
  return (
    <div
      className={`flex absolute rounded-md z-20 
      border-0 p-0
      md:border-4 md:border-violet-500 md:p-2 
      ${attrs.className}`}
      style={{ width: 'calc(100% - 4px)', ...attrs.style }}
      {...rest}
    >
      <div className={`flex-auto p-2 bg-violet-50  rounded-md animate-pulse`}>
        <h3 className={`text-violet-500 font-semibold  text-[10px] sm:text-sm`}>{title}</h3>
        <p className=" sm:text-xs text-[8px]  text-gray-500">
          {professor} {location}
        </p>
      </div>
    </div>
  );
}

export default WireSchedules;
