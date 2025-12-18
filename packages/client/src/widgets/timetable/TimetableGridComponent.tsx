import React, { useRef } from 'react';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { useUpdateTimetableRef } from '@/features/timetable/timetable/useUpdateTimetableOptions.ts';
import { ROW_HEIGHT } from '@/widgets/timetable/TimetableComponent.tsx';

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

export default TimetableGridComponent;
