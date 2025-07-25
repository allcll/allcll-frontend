import React from 'react';
import Schedule from '@/components/timetable/Schedule.tsx';
import WireSchedules from '@/components/timetable/WireSchedules.tsx';
import { initCustomSchedule, ScheduleTime } from '@/hooks/server/useTimetableData.ts';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';
import useScheduleModal, { useScheduleTimeslot } from '@/hooks/useScheduleModal.ts';
import { Day } from '@/utils/types.ts';

interface IDayScheduleProps {
  dayOfWeek: Day;
  scheduleTimes: ScheduleTime[];
}

const DaySchedule = ({ dayOfWeek, scheduleTimes }: Readonly<IDayScheduleProps>) => {
  const Timeslots = scheduleTimes;
  const { setOptimisticSchedule, openScheduleModal } = useScheduleModal();
  const { getTimeslot } = useScheduleTimeslot();

  const onDragChange = (_: number, startY: number, __: number, nowY: number) => {
    const { startTime, endTime } = getTimeslot(startY, nowY, 1);
    setOptimisticSchedule({
      ...initCustomSchedule,
      timeslots: [{ dayOfWeek, startTime, endTime }],
    });
  };

  const onDragEnd = (_: number, startY: number, __: number, nowY: number) => {
    const { startTime, endTime } = getTimeslot(startY, nowY, 1);
    openScheduleModal({
      ...initCustomSchedule,
      timeslots: [{ dayOfWeek, startTime, endTime }],
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openScheduleModal({ ...initCustomSchedule });
    }
  };

  const { onMouseDown } = useScheduleDrag(onDragChange, onDragEnd);

  return (
    <div className="relative flex-auto px-[2px]" tabIndex={0} onMouseDown={onMouseDown} onKeyDown={onKeyDown}>
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
};

export default DaySchedule;
