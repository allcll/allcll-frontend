import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import { RECENT_SEMESTERS, SEMESTERS } from '@/entities/semester/api/semester';

// FALL_25 ~ 최신학기
const START_SEMESTER_CODE = 'FALL_25';

const startIdx = SEMESTERS.findIndex(s => s.semesterCode === START_SEMESTER_CODE);
export const TIMETABLE_SEMESTERS = startIdx !== -1 ? SEMESTERS.slice(0, startIdx + 1) : [];

function findTimetableSemester(code: string | null) {
  if (!code) return undefined;
  return TIMETABLE_SEMESTERS.find(s => s.semesterCode.toLowerCase() === code.toLowerCase())?.semesterCode;
}

export function useTimetableSemester() {
  const { data } = useServiceSemester('timetable');
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultSemester = data?.semesterCode;
  const semesterParam = searchParams.get('semester');
  const validSemester = findTimetableSemester(semesterParam);
  const currentSemester = validSemester ?? defaultSemester;

  useEffect(() => {
    const nextSemester = validSemester ?? defaultSemester;
    if (!nextSemester || nextSemester === semesterParam) return;

    setSearchParams(
      prev => {
        prev.set('semester', nextSemester);
        return prev;
      },
      { replace: true },
    );
  }, [semesterParam, validSemester, defaultSemester, setSearchParams]);

  return {
    currentSemester: currentSemester ?? RECENT_SEMESTERS.semesterCode,
    defaultSemester,
    isLoading: !data,
  };
}
