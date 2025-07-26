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
  const { schedule } = useScheduleState();
  const { data: subjects } = useSubject();

  if (!subjects || !schedule.timeSlots || schedule.timeSlots.length <= 0) return null;

  // Fixme: schedule 형태 통일
  const newSchedule = new ScheduleAdapter(schedule, subjects).toUiData();
  const timeSlots = new TimeslotAdapter(newSchedule.timeSlots).toUiData(9); // Todo: getMinTime
  const scheduleTime = timeSlots.filter(({ dayOfWeek: day }) => day === dayOfWeeks);

  if (!scheduleTime) return null;

  const { subjectName, professorName, location } = newSchedule;

  return scheduleTime.map(({ width, height, top }, index) => (
    <WireSchedule
      key={`wire-schedule-${dayOfWeeks}-${index}`}
      title={subjectName ?? ''}
      professor={professorName ?? ''}
      location={location ?? ''}
      schedule={schedule}
      style={{ width, height, top }}
    />
  ));
}

function WireSchedule({ title, professor, location, ...attrs }: Readonly<IScheduleProps>) {
  return (
    <div
      className={`flex absolute rounded-md border-4 border-violet-500 z-20 ` + attrs.className}
      style={{ width: 'calc(100% - 4px)', ...attrs.style }}
      {...attrs}
    >
      <div className={`flex-auto p-2 bg-violet-50 rounded-md animate-pulse`}>
        <h3 className={`text-violet-500 font-semibold text-sm`}>{title}</h3>
        <p className="text-xs text-gray-500">
          {professor} {location}
        </p>
      </div>
    </div>
  );
}

export default WireSchedules;
