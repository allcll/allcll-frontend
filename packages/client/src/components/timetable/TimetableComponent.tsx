import React, { useEffect, useRef } from 'react';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';
import TmNumsComponent from '@/components/timetable/TmNumsComponent.tsx';
import ScheduleSlotList from '@/components/timetable/ScheduleSlotList.tsx';
import { useUpdateTimetableRef, useUpdateTimetableOptions } from '@/hooks/timetable/useUpdateTimetableOptions.ts';
import { getScheduleSlots, ScheduleSlot, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { Day, DAYS } from '@/utils/types.ts';

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
  const { colNames } = useScheduleState(state => state.options);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots = getScheduleSlots(schedules) ?? DefaultScheduleTimes;

  useUpdateTimetableOptions(schedules);

  return colNames.map(dayName => (
    <DaySchedule key={'day-schedule-' + dayName} scheduleTimes={scheduleSlots[dayName] ?? []} dayOfWeeks={dayName} />
  ));
}

interface ITimetableGridProps {
  colNames?: Day[];
  rowNames?: string[];
  headerWidth?: number;
  rowHeight?: number;
  children?: React.ReactNode;
}

function TimetableGrid({ rowHeight = ROW_HEIGHT, children }: Readonly<ITimetableGridProps>) {
  const timetableRef = useRef<HTMLDivElement | null>(null);
  const { colNames, rowNames, isMobile } = useScheduleState(state => state.options);

  useUpdateTimetableRef(timetableRef);

  const { headerWidth, headerHeight } = isMobile
    ? { headerWidth: 20, headerHeight: 20 }
    : { headerWidth: 60, headerHeight: 40 };

  return (
    <div className="relative w-full bg-white">
      {/*header*/}
      <div className="flex bg-gray-50 rounded-t-md" style={{ height: `${headerHeight}px` }}>
        <div
          className="flex items-center justify-center font-semibold text-gray-700"
          style={{ width: `${headerWidth}px` }}
        />

        {colNames.map((name, i) => (
          <div
            key={'timetable-grid-header-' + i}
            className="flex flex-auto items-center justify-center font-semibold text-gray-400 text-[10px] md:text-sm"
          >
            {name}
          </div>
        ))}
      </div>

      {/*col lines*/}
      <div className="flex absolute inset-0" style={{ top: `${headerHeight}px`, left: `${headerWidth}px` }}>
        {colNames.map((_, i) => (
          <div key={'timetable-grid-col-' + i} className="flex-auto border-l border-gray-200 h-full" />
        ))}
      </div>

      {/*row lines*/}
      {rowNames.map((rowName, i) => (
        <div key={'timetable-grid-row-' + i} className="border-b border-gray-200" style={{ height: `${rowHeight}px` }}>
          <span
            className={`flex items-center justify-center h-full text-gray-400 w-[20px] md:w-[60px] text-[10px] md:text-sm`}
          >
            {rowName}
          </span>
        </div>
      ))}

      {/*children*/}
      <div
        id="timetable"
        ref={timetableRef}
        className="absolute inset-0 flex z-10"
        style={{ top: `${headerHeight}px`, left: `${headerWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
}

export default TimetableComponent;
