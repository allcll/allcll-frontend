import React, { useEffect, useRef } from 'react';
import DaySchedule from '@/widgets/timetable/DaySchedule.tsx';
import TmNumsComponent from '@/widgets/timetable/TmNumsComponent.tsx';
import ScheduleSlotList from '@/widgets/timetable/ScheduleSlotList.tsx';
import { useUpdateTimetableOptions } from '@/features/timetable/lib/useUpdateTimetableOptions.ts';
import { GeneralSchedule, getScheduleSlots, ScheduleSlot } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import useNotifyDeletedSchedule from '@/features/notification/lib/useNotifyDeletedSchedule.ts';
import TimetableGridComponent from '@/widgets/timetable/TimetableGridComponent.tsx';

import { Day, DAYS } from '@/entities/timetable/model/types.ts';

export const ROW_HEIGHT = 40;

interface ITimetableComponentProps {
  schedules: GeneralSchedule[];
}

function TimetableComponent({ schedules }: ITimetableComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setOptions = useScheduleState(state => state.setOptions);

  useEffect(() => {
    setOptions({ containerRef: containerRef?.current ?? null });
  }, [containerRef]);

  return (
    <>
      <div className="bg-white" ref={containerRef}>
        <TimetableGrid>
          <WeekTable schedules={schedules} />
        </TimetableGrid>
        <ScheduleSlotList schedules={schedules} />
      </div>
      <TmNumsComponent schedules={schedules} />
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

function WeekTable({ schedules }: { schedules: GeneralSchedule[] }) {
  const { colNames, minTime } = useScheduleState(state => state.options);

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
