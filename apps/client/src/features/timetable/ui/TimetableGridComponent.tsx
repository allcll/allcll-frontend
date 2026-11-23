import React, { useRef } from 'react';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { useUpdateTimetableRef } from '@/features/timetable/lib/useUpdateTimetableOptions.ts';
import { ROW_HEIGHT } from '@/entities/timetable/model/layout.ts';

interface ITimetableGridComponent {
  rowHeight?: number;
  colNames: string[];
  rowNames: string[];
  children?: React.ReactNode;
}

function TimetableGridComponent({ rowHeight = ROW_HEIGHT, colNames, rowNames, children }: ITimetableGridComponent) {
  const timetableRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useScheduleState(state => state.options);

  useUpdateTimetableRef(timetableRef);

  const { headerWidth, headerHeight } = isMobile
    ? { headerWidth: 20, headerHeight: 20 }
    : { headerWidth: 60, headerHeight: 40 };

  return (
    <div className="relative w-full bg-surface">
      {/*header*/}
      <div className="flex bg-surface-subtle rounded-t-md" style={{ height: `${headerHeight}px` }}>
        <div
          className="flex items-center justify-center font-semibold text-fg-secondary"
          style={{ width: `${headerWidth}px` }}
        />

        {colNames.map((name, i) => (
          <div
            key={'timetable-grid-header-' + i}
            className="flex flex-auto items-center justify-center font-semibold text-fg-subtle text-[10px] md:text-sm"
          >
            {name}
          </div>
        ))}
      </div>

      {/*col lines*/}
      <div className="flex absolute inset-0" style={{ top: `${headerHeight}px`, left: `${headerWidth}px` }}>
        {colNames.map((_, i) => (
          <div key={'timetable-grid-col-' + i} className="flex-auto border-l border-line h-full" />
        ))}
      </div>

      {/*row lines*/}
      {rowNames.map((rowName, i) => (
        <div key={'timetable-grid-row-' + i} className="border-b border-line" style={{ height: `${rowHeight}px` }}>
          <span
            className={`flex items-center justify-center h-full text-fg-subtle w-[20px] md:w-[60px] text-[10px] md:text-sm`}
          >
            {rowName}
          </span>
        </div>
      ))}

      {/*children*/}
      <div
        id="timetable"
        ref={timetableRef}
        className="absolute inset-0 flex z-content"
        style={{ top: `${headerHeight}px`, left: `${headerWidth}px` }}
      >
        {children}
      </div>
    </div>
  );
}

export default TimetableGridComponent;
