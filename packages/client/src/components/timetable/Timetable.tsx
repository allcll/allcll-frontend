import React, { useRef } from 'react';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';
import { useUpdateTimetableRef, useUpdateTimetableOptions } from '@/hooks/timetable/useUpdateTimetableOptions.ts';
import { getScheduleSlots, ScheduleTime, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { Day } from '@/utils/types.ts';

export const HEADER_WIDTH = 60;
export const ROW_HEIGHT = 40;

function Timetable() {
  return (
    <TimetableGrid>
      <WeekTable />
    </TimetableGrid>
  );
}

const DefaultScheduleTimes: Record<Day, ScheduleTime[]> = {
  월: [],
  화: [],
  수: [],
  목: [],
  금: [],
  토: [],
  일: [],
};

function WeekTable() {
  const timetableId = useScheduleState(state => state.currentTimetable?.timeTableId);
  const { colNames } = useScheduleState(state => state.options);

  const { data: schedules } = useTimetableSchedules(timetableId);
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

function TimetableGrid({
  headerWidth = HEADER_WIDTH,
  rowHeight = ROW_HEIGHT,
  children,
}: Readonly<ITimetableGridProps>) {
  const timetableRef = useRef<HTMLDivElement | null>(null);
  const { colNames, rowNames } = useScheduleState(state => state.options);

  useUpdateTimetableRef(timetableRef);

  return (
    <div className="relative w-full">
      {/*header*/}
      <div className="flex bg-gray-50 rounded-t-md" style={{ height: `${rowHeight}px` }}>
        <div
          className="flex items-center justify-center font-semibold text-gray-700"
          style={{ width: `${headerWidth}px` }}
        />

        {colNames.map((name, i) => (
          <div
            key={'timetable-grid-header-' + i}
            className="flex flex-auto items-center justify-center font-semibold text-gray-400"
          >
            {name}
          </div>
        ))}
      </div>

      {/*col lines*/}
      <div className="flex absolute inset-0" style={{ top: `${rowHeight}px`, left: `${headerWidth}px` }}>
        {colNames.map((_, i) => (
          <div key={'timetable-grid-col-' + i} className="flex-auto border-l border-gray-200 h-full" />
        ))}
      </div>

      {/*row lines*/}
      {rowNames.map((rowName, i) => (
        <div key={'timetable-grid-row-' + i} className="border-b border-gray-200" style={{ height: `${rowHeight}px` }}>
          <span
            className={`flex items-center justify-center h-full text-gray-400 ${
              Number(rowName) >= 9 && Number(rowName) <= 20
                ? 'w-[20px] md:w-[60px] text-[10px] md:text-sm'
                : `w-[60px] text-sm`
            }`}
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
        style={{ top: `${rowHeight}px`, left: `${headerWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
}

export default Timetable;
