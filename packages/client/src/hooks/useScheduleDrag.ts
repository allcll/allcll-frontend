import React, { useCallback, useEffect, useState } from 'react';
import { IMutateScheduleState, useScheduleState } from '@/store/useScheduleState.ts';
import { HEADER_WIDTH, ROW_HEIGHT } from '@/components/timetable/Timetable.tsx';

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

  // useRef를 사용하여 항상 최신 dragData를 참조하도록 합니다.
  useEffect(() => {
    console.log('Drag data updated:', dragData);
  }, [dragData]);

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

  useEffect(() => {
    if (!dragData.dragging) return;

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

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [dragData, onAreaChanged, onDragEnd]); // 의존성 배열에서 dragData 제거

  return {
    dragging: dragData.dragging,
    onMouseDown,
  };
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useUpdateScheduleOptions = (
  timetableRef: React.RefObject<HTMLDivElement | null>,
  colNames: string[],
  rowNames: string[],
) => {
  const setOptions = useScheduleState(state => state.setOptions);

  useEffect(() => {
    setOptions({
      rowNames,
      colNames,
      cols: colNames.length || 5,
      rows: rowNames.length || 11,
    });
  }, [colNames, rowNames]);

  useEffect(() => {
    if (!timetableRef.current) return;

    const updateSizeOptions = () => {
      if (!timetableRef.current) return;

      const rect = timetableRef.current.getBoundingClientRect();
      setOptions({
        width: rect.width,
        height: rect.height,
        tableX: timetableRef.current.offsetLeft + HEADER_WIDTH,
        tableY: timetableRef.current.offsetTop + ROW_HEIGHT,
      });
      console.log('Updated timetable options:', {
        width: rect.width,
        height: rect.height,
        tableX: timetableRef.current.offsetLeft + HEADER_WIDTH,
        tableY: timetableRef.current.offsetTop + ROW_HEIGHT,
      });

      timer = null;
    };

    const onResize = () => {
      if (timer) return;
      timer = setTimeout(updateSizeOptions, 300);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [timetableRef]);
};

const TIME_DIV_COUNT = 6;
function getDragPosition(
  e: MouseEvent | React.MouseEvent<HTMLDivElement>,
  timetableOptions: IMutateScheduleState['options'],
) {
  const { tableX, tableY, width, height, cols, rows } = timetableOptions;
  console.log(e.clientX, e.clientY, tableX, tableY, width, height, cols, rows);

  const colWidth = width / cols || 1;
  const rowHeight = height / rows || 1;

  // 마우스의 절대 위치(e.clientX)에서 테이블의 절대 위치(tableX)를 빼서 상대 위치를 계산합니다.
  const x = Math.floor((e.clientX - tableX) / colWidth);
  const y = Math.floor(((e.clientY - tableY) / rowHeight) * TIME_DIV_COUNT) / TIME_DIV_COUNT;

  const clippedX = Math.max(0, Math.min(cols - 1, x)); // 최대값을 cols - 1로 수정
  const clippedY = Math.max(0, Math.min(rows - 1, y)); // 최대값을 rows - 1로 수정

  return { x: clippedX, y: clippedY };
}
