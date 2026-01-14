import React, { useCallback, useEffect, useState } from 'react';
import { IMutateScheduleState, useScheduleState } from '@/features/timetable/model/useScheduleState.ts';

interface IDragData {
  dragging: boolean;
  startX: number;
  startY: number;
}

type UpdateFunction = (startX: number, startY: number, nowX: number, nowY: number) => void;

export function useScheduleDrag(onAreaChanged: UpdateFunction, onDragEnd: UpdateFunction) {
  const timetableOptions = useScheduleState(state => state.options);

  const [dragData, setDragData] = useState<IDragData>({
    dragging: false,
    startX: 0,
    startY: 0,
  });

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      // 이벤트 핸들러에서는 ref의 최신 값을 사용합니다.
      const { x, y } = getDragPosition(e, timetableOptions);
      if (onAreaChanged) onAreaChanged(x, y, x, y);

      setDragData({ startX: x, startY: y, dragging: true });
    },
    [onAreaChanged], // 의존성 배열에서 dragData를 제거하여 불필요한 함수 재생성을 방지합니다.
  );

  const onMouseUp = (e: MouseEvent) => {
    e.stopPropagation();

    // 이벤트 핸들러에서는 ref의 최신 값을 사용합니다.
    const { x, y } = getDragPosition(e, timetableOptions);
    if (onDragEnd) onDragEnd(dragData.startX, dragData.startY, x, y);

    setDragData(prev => ({ ...prev, dragging: false }));
  };

  const onMouseMove = (e: MouseEvent) => {
    e.stopPropagation();

    // 이벤트 핸들러에서는 ref의 최신 값을 사용합니다.
    const { x, y } = getDragPosition(e, timetableOptions);
    if (onAreaChanged) onAreaChanged(dragData.startX, dragData.startY, x, y);
  };

  const onTouchMove = (e: TouchEvent) => {
    e.stopPropagation();

    // 터치 이벤트에서 첫 번째 터치 포인트를 사용합니다.
    const touch = e.touches[0];
    const { x, y } = getDragPosition(touch, timetableOptions);
    if (onAreaChanged) onAreaChanged(dragData.startX, dragData.startY, x, y);
  };

  useEffect(() => {
    if (!dragData.dragging) return;

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [dragData, onAreaChanged, onDragEnd]); // 의존성 배열에서 dragData 제거

  return {
    dragging: dragData.dragging,
    onMouseDown,
  };
}

const TIME_DIV_COUNT = 6;
function getDragPosition(
  e: MouseEvent | React.MouseEvent<HTMLDivElement> | React.Touch,
  timetableOptions: IMutateScheduleState['options'],
) {
  const { tableX, tableY, width, height, cols, rows } = timetableOptions;
  const { pageX, pageY } = e;

  const colWidth = width / cols || 1;
  const rowHeight = height / rows || 1;

  // 마우스의 절대 위치(e.clientX)에서 테이블의 절대 위치(tableX)를 빼서 상대 위치를 계산합니다.
  const x = Math.floor((pageX - tableX) / colWidth);
  const y = Math.floor(((pageY - tableY) / rowHeight) * TIME_DIV_COUNT) / TIME_DIV_COUNT;

  const clippedX = Math.max(0, Math.min(cols - 1, x)); // 최대값을 cols - 1로 수정
  const clippedY = Math.max(0, Math.min(rows, y)); // 최대값을 rows - 1로 수정

  return { x: clippedX, y: clippedY };
}
