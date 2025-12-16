import { useScheduleState } from '@/store/useScheduleState';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TimetableType } from '../server/useTimetableSchedules';

/**
 * 시간표의 학기 정보가 바뀌면 동기화 하는 훅
 * 동기화 해야하는 정보
 * - currentTimetable
 * - Timetables
 * -과목 데이터
 */
const useSemesterTimetableSync = (timetables: TimetableType[]) => {
  const [params] = useSearchParams();
  const currentSemester = params.get('semester');

  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const pickTimetable = useScheduleState(state => state.pickTimetable);

  const filteredTimetablesBySemester = timetables.filter(
    (timetable: TimetableType) => timetable.semester === currentSemester,
  );

  useEffect(() => {
    if (currentTimetable?.semester !== currentSemester) {
      const semesterTimetable = timetables.find(timetable => timetable.semester === currentSemester);

      if (semesterTimetable !== undefined) {
        pickTimetable(semesterTimetable);
        return;
      }

      // 해당 학기에 맞는 시간표가 없으면 초기화
      pickTimetable(null);
    }
  }, [currentSemester, timetables]);

  return {
    currentSemester,
    currentTimetable,
    filteredTimetablesBySemester,
  };
};

export default useSemesterTimetableSync;
