import React, { HTMLAttributes, useRef } from 'react';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';
import { Schedule as ScheduleType } from '@/hooks/server/useTimetableSchedules.ts';
import { moveTimeSlot } from '@/utils/timetable/adapter.ts';
import { useScheduleState } from '@/store/useScheduleState';

type ColorType = 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet';

export interface IScheduleProps extends HTMLAttributes<HTMLDivElement> {
  timeslotIndex: number;
  title: string;
  professor: string;
  location: string;
  schedule: ScheduleType;
  selected?: boolean;
  color?: ColorType;
}

function Schedule({
  title,
  professor,
  location,
  color = 'blue',
  schedule,
  selected = false,
  timeslotIndex,
  ...attrs
}: Readonly<IScheduleProps>) {
  const { text, bgLight, bg } = getColors(color);
  const ref = useRef<HTMLDivElement>(null);
  const { openScheduleModal } = useScheduleModal();
  const selectedSchedule = useScheduleState(state => state.schedule);

  const isSelected = selected || selectedSchedule.scheduleId === schedule.scheduleId;

  const onAreaChanged = (startX: number, startY: number, nowX: number, nowY: number) => {
    if (!ref.current) return;

    const diffX = nowX - startX;
    const diffY = (nowY - startY) * ROW_HEIGHT;

    // setTransform()
    ref.current.style.setProperty('transform', `translate(calc(100% * ${diffX}), ${diffY}px)`);
  };

  const onDragEnd = (startX: number, startY: number, nowX: number, nowY: number) => {
    if (!ref.current) return;

    if (schedule.scheduleType === 'official') {
      ref.current.style.setProperty('transform', '');
    }

    // 옮긴 시간대에 대한 시간 계산
    const updatedSchedule = {
      ...schedule,
      timeSlots: schedule.timeSlots.map((ts, index) => {
        if (index !== timeslotIndex) return ts;
        return moveTimeSlot(ts, nowX - startX, nowY - startY);
      }),
    };

    openScheduleModal(updatedSchedule);
    ref.current.style.setProperty('transform', '');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onDragEnd(0, 0, 0, 0); // 임시로 0, 0 으로 설정
    }
  };

  const { dragging, onMouseDown } = useScheduleDrag(onAreaChanged, onDragEnd);

  return (
    <div
      ref={ref}
      className={`flex absolute ${bgLight} rounded-l-xs cursor-pointer ` + attrs.className}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      tabIndex={0}
      {...attrs}
    >
      <div className={`w-[2px] h-full sm:w-1 sm:rounded-xs  ${bg}`} />
      <div
        className={'flex-auto sm:p-2 p-[1px] ' + (isSelected ? 'animate-pulse' : '') + (dragging ? 'opacity-50' : '')}
      >
        <h3 className={`${text} font-semibold text-[9px] sm:text-sm`}>{title}</h3>
        <p className="sm:text-xs text-[7px] text-gray-500">
          {professor} {location}
        </p>
      </div>
    </div>
  );
}

interface Colors {
  text: string;
  bgLight: string;
  bg: string;
}

// Todo: 색상을 colors.ts 로 분리하기
export function getColors(color: ColorType): Colors {
  switch (color) {
    case 'rose':
      return { text: 'text-rose-500', bgLight: 'bg-rose-50', bg: 'bg-rose-500' };
    case 'amber':
      return { text: 'text-amber-500', bgLight: 'bg-amber-50', bg: 'bg-amber-500' };
    case 'green':
      return { text: 'text-green-500', bgLight: 'bg-green-50', bg: 'bg-green-500' };
    case 'emerald':
      return { text: 'text-emerald-500', bgLight: 'bg-emerald-50', bg: 'bg-emerald-500' };
    case 'blue':
      return { text: 'text-blue-500', bgLight: 'bg-blue-50', bg: 'bg-blue-500' };
    case 'violet':
      return { text: 'text-violet-500', bgLight: 'bg-violet-50', bg: 'bg-violet-500' };
    default:
      return { text: 'text-gray-500', bgLight: 'bg-gray-50', bg: 'bg-gray-500' };
  }
}

export default Schedule;
