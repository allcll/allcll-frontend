import { HTMLAttributes } from 'react';
import { scheduleAsApiSchedule, scheduleTimeAdapter } from '@/hooks/server/useTimetableData.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { IScheduleProps } from '@/components/timetable/Schedule.tsx';
import useWishes from '@/hooks/server/useWishes.ts';
import { Day } from '@/utils/types.ts';

interface IWireSchedulesProps extends HTMLAttributes<HTMLDivElement> {
  dayOfWeeks: Day;
}

function WireSchedules({ dayOfWeeks }: Readonly<IWireSchedulesProps>) {
  const { schedule } = useScheduleState();
  const { data: wishes } = useWishes();

  // Fixme: schedule 형태 통일
  if (!wishes || !schedule.timeSlots || schedule.timeSlots.length <= 0) return null;

  const timetable = scheduleTimeAdapter({ schedules: [scheduleAsApiSchedule(schedule)] }, wishes);
  const scheduleTime = timetable?.scheduleTimes[dayOfWeeks];

  if (!scheduleTime) return null;

  return scheduleTime.map(({ title, professor, location, width, height, top, schedule }, index) => (
    <WireSchedule
      key={`wire-schedule-${dayOfWeeks}-${index}`}
      title={title}
      professor={professor ?? ''}
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
