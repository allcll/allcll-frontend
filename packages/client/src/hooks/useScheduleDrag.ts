import { useEffect, useRef, useState } from 'react';
// import { ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';

// reference error - ROW_HEIGHT not initialized
// const DRAG_AREA_SIZE = ROW_HEIGHT / 4;

export function useScheduleDrag(onAreaChanged, onDragEnd) {
  const [dragging, setDragging] = useState(false);

  const dragData = useRef({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });
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

  return {
    dragging,
    onMouseDown,
  };
}
