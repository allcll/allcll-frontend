/**
 * 학기/서비스 기간 설정 모음 (client/admin 공용)
 * 학기 롤오버, 서비스 기간 변경 시 이 파일의 값을 수정합니다.
 * client/admin 양쪽에서 import 하므로 React/Vite(import.meta.env) 의존을 두지 않습니다.
 * preseat 기간은 operation-period API로 관리하므로 여기서 다루지 않습니다.
 */

export interface ISemesterInfo {
  semesterCode: string;
  semesterValue: string;
}

export type ServiceId = 'timetable' | 'baskets' | 'simulation' | 'live' | 'preSeat';

export interface IServicePeriodConfig {
  id: ServiceId;
  startDate: string;
  devStartDate?: string; // dev 서버에서 먼저 확인하기 위한 시작일
  endDate: string;
  message: string | null;
}

/**
 * 학기 목록 -> 0번째 인덱스가 최신 학기
 * @description 지난 학기 과목은 packages/client/public/<semesterCode>/subjects.json 스냅샷에서 읽으므로,
 * 새 학기를 맨 앞에 추가하기 전에 직전 학기 스냅샷 파일이 있어야 합니다.
 */
export const SEMESTERS: ISemesterInfo[] = [
  {
    semesterCode: 'FALL_26',
    semesterValue: '2026-2',
  },
  {
    semesterCode: 'SUMMER_26',
    semesterValue: '2026-여름',
  },
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

export const CURRENT_SEMESTER = SEMESTERS[0];

// 서비스별 운영 기간 — client 서비스 기간과 admin 서비스 기간 설정 초기값의 공통 출처
export const SERVICE_PERIODS: IServicePeriodConfig[] = [
  {
    id: 'timetable',
    startDate: '2026-07-31',
    endDate: '2099-12-31',
    message: null,
  },
  {
    id: 'baskets',
    startDate: '2026-07-31',
    endDate: '2099-12-31',
    message: null,
  },
  {
    id: 'simulation',
    startDate: '2026-07-31',
    endDate: '2099-12-31',
    message: null,
  },
  {
    id: 'live',
    startDate: '2026-06-01',
    devStartDate: '2026-05-28',
    endDate: '2026-06-12',
    message: null,
  },
  {
    id: 'preSeat',
    startDate: '2026-06-02',
    endDate: '2026-06-11',
    message: null,
  },
];

// 메인 배너 수강신청 일정 표기
// TODO: preseat 기간 자동 관리 PR(#394) 머지 후 operation-period API 참조로 전환해 이 상수들을 제거
export const BANNER_PERIOD_LABEL = '수강신청 기간';
export const BANNER_START_DATE = '08/14(금)';
export const BANNER_END_DATE = '08/21(금)';

// admin 크롤러 — 이 시각 이전에는 계절 여석 크롤링, 이후에는 일반 여석 크롤링 토글을 표시
export const CRAWLER_SEASON_DATE = '2026-06-05T00:00:00+09:00';
