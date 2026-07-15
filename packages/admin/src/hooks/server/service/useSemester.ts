import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api';

export interface SemesterResponse {
  semesterCode: string;
  semesterValue: string;
  period: {
    startDate: string;
    endDate: string;
  };
}

const fetchSemester = () => {
  return fetchJsonOnAPI<SemesterResponse>('/api/service/semester');
};

// GET /api/service/semester
export function useSemester() {
  return useQuery({
    queryKey: ['semester'],
    queryFn: fetchSemester,
    staleTime: Infinity,
  });
}
