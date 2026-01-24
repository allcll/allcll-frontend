// import { fetchJsonOnAPI } from '@/utils/api.ts';

export interface ServicePeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  startDateStr: string;
  endDateStr: string;
  withinPeriod: boolean;
  message: string | null;
}

export interface ServiceSemesters {
  semesterCode: string;
  semesterValue: string;
  services: ServicePeriod[];
}

export interface ServiceSemester {
  semesterCode: string;
  semesterValue: string;
  service: ServicePeriod | undefined;
}

export interface ServicePeriodApiResponse {
  id: string;
  startDate: string;
  endDate: string;
  message: string | null;
}

export interface ServiceSemesterApiResponse {
  semesterCode: string;
  semesterValue: string;
  services: ServicePeriodApiResponse[];
}

export const fetchServiceSemester = async () => {
  // Todo: API 연동으로 바꾸기
  // return await fetchJsonOnAPI<ServiceSemester>('/api/service/semester');
  return SERVICE_SEMESTER_DUMMY;
};

const isDevServer = import.meta.env.VITE_DEV_SERVER === 'true';

/**
 * 학기 목록 -> 0번째 인덱스가 최신 학기
 * @description
 */
export const SEMESTERS = [
  {
    semesterCode: 'SPRING_26',
    semesterValue: '2026-1',
  },
  {
    semesterCode: 'WINTER_25',
    semesterValue: '2025-겨울',
  },
  {
    semesterCode: 'FALL_25',
    semesterValue: '2025-2',
  },
  {
    semesterCode: 'SUMMER_25',
    semesterValue: '2025-여름',
  },
  {
    semesterCode: 'SPRING_25',
    semesterValue: '2025-1',
  },
];

export const RECENT_SEMESTERS = SEMESTERS[0];

/** @description 서비스 학기 더미 데이터
 * 서비스 API연결하기 전까지 해당 데이터 사용하기
 * @deprecated fetchServiceSemester로 대체, 또는 useServiceSemester 을 사용하세요. */
const SERVICE_SEMESTER_DUMMY: ServiceSemesterApiResponse = {
  semesterCode: 'SPRING_26',
  semesterValue: '2026-1',
  services: [
    {
      id: 'timetable',
      startDate: '2026-01-23',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'baskets',
      startDate: '2026-01-23',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'simulation',
      startDate: '2026-01-23',
      endDate: '2099-12-31',
      message: null,
    },
    {
      id: 'live',
      startDate: isDevServer ? '2026-01-23' : '2026-02-09', //dev서버에서 먼저 확인 하기 위해
      endDate: '2026-03-09',
      message: null,
    },
    {
      id: 'preSeat',
      startDate: '2026-02-10',
      endDate: '2026-03-09',
      message: null,
    },
  ],
};
