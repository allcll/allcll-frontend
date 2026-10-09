import { CURRENT_SEMESTER } from '@allcll/common';

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

/**
 * 학기 목록 -> 0번째 인덱스가 최신 학기
 * @description 학기 추가/변경은 packages/common/src/lib/semester/config.ts 에서 관리
 */
export { SEMESTERS } from '@allcll/common';

export const RECENT_SEMESTERS = CURRENT_SEMESTER;
