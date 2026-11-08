import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { useEffect } from 'react';
import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';

/**
 * 시간표의 학기 정보가 바뀌면 동기화 하는 훅
 * 동기화 해야하는 정보
 * - currentTimetable
 * - Timetables
 * -과목 데이터
 * - TODO: 향후 과목 데이터도 동기화 필요
 */
const useSemesterTimetableSync = (currentSemester: string, timetables: TimetableType[]) => {
  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const pickTimetable = useScheduleState(state => state.pickTimetable);

  useEffect(() => {
    pickTimetable(timetables[0]);
  }, [currentSemester]);

  return {
    currentSemester,
    currentTimetable,
  };
};

export default useSemesterTimetableSync;
