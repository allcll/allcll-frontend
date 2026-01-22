import { useSearchParams } from 'react-router-dom';
import { SEMESTERS } from '../api/semester';

export function useSemesterParam() {
  const [searchParams] = useSearchParams();
  return searchParams.get('semester') ?? SEMESTERS[SEMESTERS.length - 1];
}
