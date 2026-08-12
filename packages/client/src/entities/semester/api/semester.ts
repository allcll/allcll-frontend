// import { fetchJsonOnAPI } from '@/utils/api.ts';
import { CURRENT_SEMESTER, SERVICE_PERIODS } from '@allcll/common';

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
 * @description 학기 추가/변경은 packages/common/src/lib/semester/config.ts 에서 관리
 */
export { SEMESTERS } from '@allcll/common';

export const RECENT_SEMESTERS = CURRENT_SEMESTER;

/** @description 서비스 학기 더미 데이터
 * 서비스 API연결하기 전까지 해당 데이터 사용하기
 * @deprecated fetchServiceSemester로 대체, 또는 useServiceSemester 을 사용하세요. */
const SERVICE_SEMESTER_DUMMY: ServiceSemesterApiResponse = {
  semesterCode: CURRENT_SEMESTER.semesterCode,
  semesterValue: CURRENT_SEMESTER.semesterValue,
  services: SERVICE_PERIODS.map(({ id, startDate, devStartDate, endDate, message }) => ({
    id,
    startDate: isDevServer && devStartDate ? devStartDate : startDate, //dev서버에서 먼저 확인 하기 위해
    endDate,
    message,
  })),
};
