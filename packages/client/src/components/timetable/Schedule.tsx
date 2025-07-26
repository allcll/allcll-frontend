import React, { HTMLAttributes, useRef } from 'react';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';
import useScheduleModal from '@/hooks/useScheduleModal';
import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';
import { Schedule as ScheduleType } from '@/hooks/server/useTimetableSchedules.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';

type ColorType = 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet';

export interface IScheduleProps extends HTMLAttributes<HTMLDivElement> {
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
  ...attrs
}: Readonly<IScheduleProps>) {
  const { text, bgLight, bg } = getColors(color);
  const ref = useRef<HTMLDivElement>(null);
  const { openScheduleModal } = useScheduleModal();

  const onAreaChanged = (startX: number, startY: number, nowX: number, nowY: number) => {
    if (!ref.current) return;

    const diffX = nowX - startX;
    const diffY = (nowY - startY) * ROW_HEIGHT;

    // setTransform()
    ref.current.style.setProperty('transform', `translate(calc(100% * ${diffX}), ${diffY}px)`);
  };

  const onDragEnd = (_: number, __: number, nowX: number, nowY: number) => {
    if (!ref.current) return;

    console.log(nowX, nowY);

    // Todo: schedule 감지, schedule 업데이트 로직 추가
    const updatedSchedule = { ...schedule };

    openScheduleModal(updatedSchedule);
    ref.current.style.setProperty('transform', '');
  };

  const { dragging, onMouseDown } = useScheduleDrag(onAreaChanged, onDragEnd);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const initSchedule = new ScheduleAdapter().toUiData();
    openScheduleModal(initSchedule);
  };

  return (
    <div
      ref={ref}
      className={`flex absolute ${bgLight} rounded-l-xs cursor-pointer ` + attrs.className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      tabIndex={0}
      {...attrs}
    >
      <div className={`w-1 h-full rounded-xs ${bg}`} />
      <div className={'flex-auto p-2 ' + (selected ? 'animate-pulse' : '') + (dragging ? 'opacity-50' : '')}>
        <h3 className={`${text} font-semibold text-sm`}>{title}</h3>
        <p className="text-xs text-gray-500">
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
