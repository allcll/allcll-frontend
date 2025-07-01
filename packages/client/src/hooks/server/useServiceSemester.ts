import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export interface ServiceSemester {
  semester: string;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ServiceSemesterWithPeriod extends ServiceSemester {
  withinPeriod: boolean;
}

function useServiceSemester() {
  return useQuery({
    queryKey: ['serviceSemester'],
    queryFn: fetchServiceSemester,
    staleTime: Infinity,
    select: data => {
      if (!data) {
        return null;
      }

      const now = new Date();
      const startDate = new Date(data.period.startDate);
      const endDate = new Date(data.period.endDate);

      // Normalize start and end dates to ensure correct comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const withinPeriod = startDate <= now && now <= endDate;

      return { withinPeriod, ...data };
    },
  });
}

const fetchServiceSemester = async () => {
  return await fetchJsonOnAPI<ServiceSemester>('/api/service/semester');
};

export default useServiceSemester;
