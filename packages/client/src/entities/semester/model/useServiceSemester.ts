import { useQuery } from '@tanstack/react-query';
import {
  fetchServiceSemester,
  ServicePeriod,
  ServicePeriodApiResponse,
  ServiceSemesters,
} from '@/entities/semester/api/semester.ts';

function useServiceSemester(serviceId?: string) {
  const query = useQuery({
    queryKey: ['serviceSemester'],
    queryFn: fetchServiceSemester,
    staleTime: Infinity,
    select: data => {
      if (!data) return null;

      return {
        ...data,
        services: data.services.map(getServiceDate),
      } as ServiceSemesters;
    },
  });

  if (!serviceId || !query.data) return query;

  const service = query.data.services.find(s => s.id === serviceId);

  return {
    ...query,
    data: {
      semesterCode: query.data.semesterCode,
      semesterValue: query.data.semesterValue,
      service,
    },
  };
}

const getServiceDate = (period: ServicePeriodApiResponse): ServicePeriod => {
  const now = new Date();
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);

  // Normalize start and end dates to ensure correct comparison
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const withinPeriod = startDate <= now && now <= endDate;

  return {
    id: period.id,
    startDate,
    endDate,
    withinPeriod,
    startDateStr: period.startDate,
    endDateStr: period.endDate,
    message: period.message,
  };
};

export default useServiceSemester;
