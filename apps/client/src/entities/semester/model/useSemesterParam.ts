import { useSearchParams } from 'react-router-dom';
import { RECENT_SEMESTERS } from '../api/semester';

export function useSemesterParam() {
  const [searchParams] = useSearchParams();
  return searchParams.get('semester') ?? RECENT_SEMESTERS.semesterCode;
}
