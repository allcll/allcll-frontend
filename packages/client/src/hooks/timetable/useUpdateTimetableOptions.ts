import React, { useEffect } from 'react';
import { GeneralSchedule } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { DAYS } from '@/utils/types.ts';

/** 이 부분은 useUpdateTimetableOptions.tsx 파일에서 테이블의 옵션을 업데이트하는 훅입니다.
 * @param schedule
 */
export function useUpdateTimetableOptions(schedule?: GeneralSchedule[]) {
  const selectedSchedule = useScheduleState(state => state.schedule);
  const setOptions = useScheduleState(state => state.setOptions);

  const scheduleToUse = [...(schedule ?? []), selectedSchedule];

  const maxDayIndex = scheduleToUse.reduce<number>((acc, item) => {
    let result = acc;
    if (!item.timeSlots) return acc;

    if (item.timeSlots.some(time => time.dayOfWeeks === '토')) result = Math.max(result, 6);
    if (item.timeSlots.some(time => time.dayOfWeeks === '일')) result = Math.max(result, 7);

    return result;
  }, 5);

  // Timetable의 시작시간, 종료시간을 계산
  const { minTime, maxTime } = scheduleToUse.reduce(
    (acc, item) => {
      item.timeSlots.forEach(time => {
        const start = parseInt(time.startTime.split(':')[0]);
        const end = parseInt(time.endTime.split(':')[0]);

        if (isNaN(start) || isNaN(end)) return;

        acc.minTime = Math.min(acc.minTime, start);
        acc.maxTime = Math.max(acc.maxTime, end);
      });
      return acc;
    },
    { minTime: 9, maxTime: 20 },
  );

  useEffect(() => {
    setOptions({
      rowNames: Array.from({ length: maxTime - minTime + 1 }, (_, i) => `${minTime + i}`),
      minTime,
      maxTime,
      rows: maxTime - minTime + 1,
    });
  }, [minTime, maxTime]);

  useEffect(() => {
    setOptions({
      colNames: DAYS.slice(0, maxDayIndex),
      cols: maxDayIndex,
    });
  }, [maxDayIndex]);

  return {};
}

let timer: ReturnType<typeof setTimeout> | null = null;
/** 테이블 크기와 옵션을 업데이트하는 훅 */
export const useUpdateTimetableRef = (timetableRef: React.RefObject<HTMLDivElement | null>) => {
  const setOptions = useScheduleState(state => state.setOptions);

  // 테이블 크기 측정 / 저장하는 함수
  const updateSizeOptions = () => {
    if (!timetableRef.current) return;

    const rect = timetableRef.current.getBoundingClientRect();
    setOptions({
      width: rect.width,
      height: rect.height,
      tableX: rect.left + window.pageXOffset,
      tableY: rect.top + window.pageYOffset,
    });

    timer = null;
  };

  useEffect(() => {
    if (!timetableRef.current) return;

    const onResize = () => {
      if (timer) return;
      timer = setTimeout(updateSizeOptions, 300);

      setOptions({ isMobile: window.innerWidth < 768 });
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [timetableRef]);
};
