import React from 'react';
import Schedule from '@/components/timetable/Schedule.tsx';
import WireSchedules from '@/components/timetable/WireSchedules.tsx';
import { initCustomSchedule, ScheduleTime } from '@/hooks/server/useTimetableData.ts';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';
import useScheduleModal, { useScheduleTimeslot } from '@/hooks/useScheduleModal.ts';
import { Day } from '@/utils/types.ts';

interface IDayScheduleProps {
  dayOfWeeks: Day;
  scheduleTimes: ScheduleTime[];
}

const DaySchedule = ({ dayOfWeeks, scheduleTimes }: Readonly<IDayScheduleProps>) => {
  const timeSlots = scheduleTimes;
  const { setOptimisticSchedule, openScheduleModal } = useScheduleModal();
  const { getTimeslot } = useScheduleTimeslot();

  const onDragChange = (_: number, startY: number, __: number, nowY: number) => {
    const { startTime, endTime } = getTimeslot(startY, nowY, 1);
    setOptimisticSchedule({
      ...initCustomSchedule,
      timeSlots: [{ dayOfWeeks, startTime, endTime }],
    });
  };

  const onDragEnd = (_: number, startY: number, __: number, nowY: number) => {
    const { startTime, endTime } = getTimeslot(startY, nowY, 1);
    openScheduleModal({
      ...initCustomSchedule,
      timeSlots: [{ dayOfWeeks, startTime, endTime }],
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
      <WireSchedules dayOfWeeks={dayOfWeeks} />
      {timeSlots.map(({ title, professor, location, color, width, height, top, schedule }, index) => (
        <Schedule
          key={'schedule-' + index}
          title={title}
          professor={professor ?? ''}
          location={location ?? ''}
          schedule={schedule}
          color={color}
          style={{ height, top, width }}
        />
      ))}
    </div>
  );
};

export default DaySchedule;
