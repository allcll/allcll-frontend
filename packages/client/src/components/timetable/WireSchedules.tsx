import { HTMLAttributes } from 'react';
import { DayNameType, scheduleTimeAdapter } from '@/hooks/server/useTimetableData.ts';
import { ScheduleMutateType, useMutateScheduleState } from '@/store/useMutateScheduleState.ts';
import { IScheduleProps } from '@/components/timetable/Schedule.tsx';
import useWishes from '@/hooks/server/useWishes.ts';

interface IWireScheduleProps extends HTMLAttributes<HTMLDivElement> {
  dayOfWeek: DayNameType;
}

function WireSchedules({ dayOfWeek }: Readonly<IWireScheduleProps>) {
  const { mode, schedule } = useMutateScheduleState();
  const { data: wishes } = useWishes();

  if (mode !== ScheduleMutateType.CREATE) return null;

  const timetable = scheduleTimeAdapter({ schedules: [schedule] }, wishes);
  const scheduleTime = timetable?.scheduleTimes[dayOfWeek];

  if (!scheduleTime) return null;

  return scheduleTime.map(({ title, professor, location }, index) => (
    <WireSchedule
      key={`wire-schedule-${dayOfWeek}-${index}`}
      title={title}
      professor={professor ?? ''}
      location={location ?? ''}
      style={{ height: 'calc(100% / 12)', width: '100%' }}
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
