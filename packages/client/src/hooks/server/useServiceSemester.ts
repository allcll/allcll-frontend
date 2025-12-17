import { useQuery } from '@tanstack/react-query';
// import { fetchJsonOnAPI } from '@/utils/api.ts';

interface ServicePeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  withinPeriod: boolean;
  message: string | null;
}

interface ServiceSemesters {
  code: string;
  semester: string;
  services: ServicePeriod[];
}

export interface ServiceSemester {
  code: string;
  semester: string;
  service: ServicePeriod | undefined;
}

interface ServicePeriodApiResponse {
  id: string;
  startDate: string;
  endDate: string;
  message: string | null;
}

export interface ServiceSemesterApiResponse {
  code: string;
  semester: string;
  services: ServicePeriodApiResponse[];
}

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
      code: query.data.code,
      semester: query.data.semester,
      service,
    },
  };
}

const fetchServiceSemester = async () => {
  // Todo: API 연동으로 바꾸기
  // return await fetchJsonOnAPI<ServiceSemester>('/api/service/semester');
  return SERVICE_SEMESTER_DUMMY;
};

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

const isDevServer = import.meta.env.VITE_DEV_SERVER === 'true';

export const SEMESTERS = ['2025-2', '2025-WINTER'];

//서비스 API연결하기 전까지 해당 데이터 사용하기
export const SERVICE_SEMESTER_DUMMY: ServiceSemesterApiResponse = {
  code: 'WINTER-2025',
  semester: '2025-WINTER',
  services: [
    {
      id: 'timetable',
      startDate: '2025-07-18',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'baskets',
      startDate: '2025-07-18',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'simulation',
      startDate: '2025-07-18',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'live',
      startDate: isDevServer ? '2025-11-29' : '2025-12-01', //dev서버에서 먼저 확인 하기 위해
      endDate: '2025-12-31',
      message: null,
    },
    {
      id: 'preSeat',
      startDate: '2025-08-16',
      endDate: '2025-09-30',
      message: null,
    },
  ],
};

export default useServiceSemester;
