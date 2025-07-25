import React, { useRef } from 'react';
import DaySchedule from '@/components/timetable/DaySchedule.tsx';
import { useUpdateScheduleOptions } from '@/hooks/useScheduleDrag.ts';
import { ScheduleTime, useTimetableData } from '@/hooks/server/useTimetableData.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { Day, DAYS } from '@/utils/types.ts';

const DEFAULT_DAY_NAMES = DAYS.slice(0, 5); // Default to weekdays
const DEFAULT_ROW_NAMES = Array.from({ length: 12 }, (_, i) => `${i + 9}`);
export const HEADER_WIDTH = 60;
export const ROW_HEIGHT = 40;

function Timetable() {
  const timetableId = useScheduleState(state => state.currentTimetable?.timeTableId);

  const { data: timetable } = useTimetableData(timetableId);
  const { scheduleTimes, colNames, rowNames } = timetable ?? {};

  return (
    <TimetableGrid colNames={colNames} rowNames={rowNames}>
      <WeekTable colNames={colNames} scheduleTimes={scheduleTimes} />
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

function WeekTable({
  colNames = DEFAULT_DAY_NAMES,
  scheduleTimes,
}: Readonly<{ colNames?: Day[]; scheduleTimes?: Record<Day, ScheduleTime[]> }>) {
  const scheduleTime = scheduleTimes ?? DefaultScheduleTimes;

  return colNames.map(dayName => (
    <DaySchedule key={'day-schedule-' + dayName} scheduleTimes={scheduleTime[dayName] ?? []} dayOfWeek={dayName} />
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
  colNames = DEFAULT_DAY_NAMES,
  rowNames = DEFAULT_ROW_NAMES,
  headerWidth = HEADER_WIDTH,
  rowHeight = ROW_HEIGHT,
  children,
}: Readonly<ITimetableGridProps>) {
  const timetableRef = useRef<HTMLDivElement | null>(null);
  useUpdateScheduleOptions(timetableRef, colNames, rowNames);

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
      <div>
        {rowNames.map((rowName, i) => (
          <div
            key={'timetable-grid-row-' + i}
            className="border-b border-gray-200"
            style={{ height: `${rowHeight}px` }} // 100% / 12 rows
          >
            <span
              className="flex items-center justify-center h-full text-gray-400"
              style={{ width: `${headerWidth}px` }}
            >
              {rowName}
            </span>
          </div>
        ))}
      </div>

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
