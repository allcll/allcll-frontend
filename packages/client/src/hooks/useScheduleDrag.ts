import React, { useEffect, useState } from 'react';
import { useScheduleState } from '@/store/useScheduleState.ts';

let timer: ReturnType<typeof setTimeout> | null = null;

interface IDragData {
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  clientX: number;
  clientY: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
}

export function useScheduleDrag(onAreaChanged, onDragEnd) {
  const timetableOptions = useScheduleState(state => state.options);
  const [dragging, setDragging] = useState(false);

  // dragData를 useState로 변경
  const [dragData, setDragData] = useState<IDragData>({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
    width: 0,
    height: 0,
    cols: 5,
    rows: 11,
  });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // dragData를 업데이트할 때 setDragData 사용
    const { x, y } = getDragPosition(e, dragData);
    console.log(`Start dragging at grid position: (${x}, ${y})`, dragData);

    setDragging(true);
  };

  useEffect(() => {
    if (!timetableOptions) return;
    if (!timetableOptions.timetableRef) return;

    const { timetableRef } = timetableOptions;

    // dragData를 업데이트할 때 setDragData 사용
    setDragData(prev => ({
      ...prev,
      cols: timetableOptions.colNames.length || 5,
      rows: timetableOptions.rowNames.length || 11,
    }));

    const onResize = () => {
      if (timer) return;

      timer = setTimeout(() => {
        if (!timetableRef) return;

        const rect = timetableRef.getBoundingClientRect();
        // dragData를 업데이트할 때 setDragData 사용
        setDragData(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height,
          clientX: rect.left,
          clientY: rect.top,
        }));
        console.log('Timetable resized:', rect, dragData); // 여기 dragData는 최신이 아닐 수 있음

        timer = null;
      }, 300);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [timetableOptions]); // dragData를 의존성 배열에 추가하지 않아도 됨. (내부에서 setDragData를 사용하므로)

  useEffect(() => {
    if (!dragging) return;

    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      // 최신 dragData 값을 바로 사용
      const { x, y } = getDragPosition(e, dragData);

      console.log(`Dropped at grid position: (${x}, ${y})`, dragData);
      setDragging(false);

      if ()
      onDragEnd && onDragEnd({ x, y }); // 필요하다면 onDragEnd 호출
    };

    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      // 최신 dragData 값을 바로 사용
      const { x, y } = getDragPosition(e, dragData);

      console.log(`Dragging at grid position: (${x}, ${y})`, dragData);
      onAreaChanged && onAreaChanged({ x, y }); // 필요하다면 onAreaChanged 호출
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [dragging, dragData, onAreaChanged, onDragEnd]); // dragData를 의존성 배열에 추가

  return {
    dragging,
    onMouseDown,
  };
}

// getDragPosition 함수는 동일하게 유지
function getDragPosition(e: MouseEvent | React.MouseEvent<HTMLDivElement>, dragData: IDragData) {
  const { clientX, clientY, width, height, cols, rows } = dragData;

  // 0으로 나누는 것을 방지
  const colWidth = width / cols || 1;
  const rowHeight = height / rows || 1;

  const x = Math.floor((e.clientX - clientX) / colWidth);
  const y = Math.floor((e.clientY - clientY) / rowHeight);

  return { x, y };
}
