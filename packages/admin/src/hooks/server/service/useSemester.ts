import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api';

export interface ISemesterResponse {
  semesterCode: string;
  semesterValue: string;
  period: {
    startDate: string;
    endDate: string;
  };
}

const fetchSemester = () => {
  return fetchJsonOnAPI<ISemesterResponse>('/api/service/semester');
};

// GET /api/service/semester
export function useSemester() {
  return useQuery({
    queryKey: ['semester'],
    queryFn: fetchSemester,
    staleTime: Infinity,
  });
}
