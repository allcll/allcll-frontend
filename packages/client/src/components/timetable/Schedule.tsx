import { HTMLAttributes, useEffect, useState } from 'react';

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
  const [dragging, setDragging] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Handle click event, e.g., open a modal or navigate to a detailed view
    console.log('Schedule clicked');
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Handle mouse down event, e.g., start dragging or selecting
    console.log('Schedule mouse down');
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const randomNumber = Math.floor(Math.random() * 1000);
    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      // Handle mouse up event, e.g., stop dragging or selecting
      console.log(randomNumber, 'Mouse up at', e.clientX, e.clientY);
      setDragging(false);
    };
    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      // Handle mouse move event, e.g., update position or size
      console.log(randomNumber, 'Mouse move at', e.clientX, e.clientY);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [dragging]);

  return (
    <div
      className={`flex absolute ${bgLight} rounded-l-xs ` + attrs.className}
      onClick={onClick}
      onMouseDown={onMouseDown}
      {...attrs}
    >
      <div className={`w-1 h-full rounded-xs ${bg}`} />
      <div className={'flex-auto p-2 ' + (selected ? 'animate-pulse' : '')}>
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
