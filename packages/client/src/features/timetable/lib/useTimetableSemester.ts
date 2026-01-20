import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import { SEMESTERS } from '@/entities/semester/api/semester';

export function useTimetableSemester() {
  const { data } = useServiceSemester('timetable');
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultSemester = data?.semester ?? SEMESTERS[SEMESTERS.length - 1];
  const currentSemester = searchParams.get('semester') ?? defaultSemester;

  useEffect(() => {
    if (!searchParams.has('semester') && defaultSemester) {
      setSearchParams({ semester: defaultSemester }, { replace: true });
    }
  }, [searchParams, defaultSemester, setSearchParams]);

  return {
    currentSemester,
    defaultSemester,
    isLoading: !data,
  };
}
