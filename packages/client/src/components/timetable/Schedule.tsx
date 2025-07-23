import { HTMLAttributes } from 'react';
import { useScheduleDrag } from '@/hooks/useScheduleDrag.ts';

type ColorType = 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet';

export interface IScheduleProps extends HTMLAttributes<HTMLDivElement> {
  // Additional props can be defined here if needed
  title: string;
  professor: string;
  location: string;
  selected?: boolean;
  color?: ColorType;
}

function Schedule({
  title,
  professor,
  location,
  color = 'blue',
  selected = false,
  ...attrs
}: Readonly<IScheduleProps>) {
  const { text, bgLight, bg } = getColors(color);
  const { dragging, onMouseDown } = useScheduleDrag(
    () => {},
    () => {},
  );

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Todo: 수정 모드
  };

  return (
    <div
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
