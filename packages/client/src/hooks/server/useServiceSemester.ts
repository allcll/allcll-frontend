import {useQuery} from '@tanstack/react-query';

export interface ServiceSemester {
  semester: string;
  period: {
    startDate: string;
    endDate: string;
  }
}

export interface ServiceSemesterWithPeriod extends ServiceSemester {
  withinPeriod: boolean;
}

function useServiceSemester() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchServiceSemester,
    staleTime: Infinity,
    select: data => {
      if (!data) {
        return null;
      }

      const now = new Date();
      const startDate = new Date(data.period.startDate);
      const endDate = new Date(data.period.endDate);

      const withinPeriod = startDate <= now && now <= endDate;

      return {withinPeriod, ...data};
    }
  });
}

const fetchServiceSemester = async (): Promise<ServiceSemester> => {
  const response = await fetch('/api/service/semester');

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default useServiceSemester;