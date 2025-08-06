import React, { useEffect, useRef } from 'react';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';
import TmNumsComponent from '@/components/timetable/TmNumsComponent.tsx';
import ScheduleSlotList from '@/components/timetable/ScheduleSlotList.tsx';
import { useUpdateTimetableOptions } from '@/hooks/timetable/useUpdateTimetableOptions.ts';
import { getScheduleSlots, ScheduleSlot, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { Day, DAYS } from '@/utils/types.ts';
import useNotifyDeletedSchedule from '@/hooks/server/useNotifyDeletedSchedule.ts';
import TimetableGridComponent from '@/components/timetable/TimetableGridComponent.tsx';

export const ROW_HEIGHT = 40;

function TimetableComponent() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setOptions = useScheduleState(state => state.setOptions);

  useEffect(() => {
    setOptions({ containerRef: containerRef?.current ?? null });
  }, [containerRef]);

  return (
    <>
      <div className="bg-white" ref={containerRef}>
        <TimetableGrid>
          <WeekTable />
        </TimetableGrid>
        <ScheduleSlotList />
      </div>
      <TmNumsComponent />
    </>
  );
}

const DefaultScheduleTimes: Record<Day, ScheduleSlot[]> = DAYS.reduce(
  (acc, day) => {
    acc[day] = [];
    return acc;
  },
  {} as Record<Day, ScheduleSlot[]>,
);

function WeekTable() {
  const currentTimetable = useScheduleState(s => s.currentTimetable);
  const { colNames, minTime } = useScheduleState(state => state.options);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots = getScheduleSlots(schedules, minTime) ?? DefaultScheduleTimes;

  useNotifyDeletedSchedule(schedules);
  useUpdateTimetableOptions(schedules);

  return colNames.map(dayName => (
    <DaySchedule key={'day-schedule-' + dayName} scheduleTimes={scheduleSlots[dayName] ?? []} dayOfWeeks={dayName} />
  ));
}

interface ITimetableGridProps {
  rowHeight?: number;
  children?: React.ReactNode;
}

function TimetableGrid({ rowHeight = ROW_HEIGHT, children }: Readonly<ITimetableGridProps>) {
  const { colNames, rowNames } = useScheduleState(state => state.options);

  return <TimetableGridComponent colNames={colNames} rowNames={rowNames} rowHeight={rowHeight} children={children} />;
}

export default TimetableComponent;
