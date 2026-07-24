/**
 * 학기/서비스 기간 설정 모음 (client/admin 공용)
 * 학기 롤오버, 서비스 기간 변경, preseat/baskets 데이터 갱신 시 이 파일의 값을 수정합니다.
 * client/admin 양쪽에서 import 하므로 React/Vite(import.meta.env) 의존을 두지 않습니다.
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

export type PreSeatMode = 'force-open' | 'auto' | 'force-close';

/**
 * 학기 목록 -> 0번째 인덱스가 최신 학기
 * @description 지난 학기 과목은 packages/client/public/<semesterCode>/subjects.json 스냅샷에서 읽으므로,
 * 새 학기를 맨 앞에 추가하기 전에 직전 학기 스냅샷 파일이 있어야 합니다.
 */
export const SEMESTERS: ISemesterInfo[] = [
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

// admin 학기 설정 표기 (예: '2026-1', '2026-하계', '2025-동계')
export const CURRENT_SEMESTER_ADMIN_LABEL = '2026-하계';

// 서비스별 운영 기간 — client 서비스 기간과 admin 서비스 기간 설정 초기값의 공통 출처
export const SERVICE_PERIODS: IServicePeriodConfig[] = [
  {
    id: 'timetable',
    startDate: '2026-05-28',
    endDate: '2099-12-31',
    message: null,
  },
  {
    id: 'baskets',
    startDate: '2026-05-28',
    endDate: '2099-12-31',
    message: null,
  },
  {
    id: 'simulation',
    startDate: '2026-05-28',
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

export const PRESEAT_MODE: PreSeatMode = 'force-open';
export const PRESEAT_CLOSE_DATE = '2026-06-11';
export const PRESEAT_START_TIME = '10:00';

// pre-seats.json 파일 업데이트 시 반드시 `PRESEAT_CACHE_VERSION` 값을 함께 변경해주세요. (YYYYMMDD)
export const PRESEAT_CACHE_VERSION = '20260608';

// baskets.json 파일 업데이트 시 반드시 `BASKETS_CACHE_VERSION` 값을 함께 변경해주세요.
export const BASKETS_CACHE_VERSION = 'SUMMER_26_20260528';

// 메인 배너 수강신청 일정 표기
export const BANNER_PERIOD_LABEL = '수강신청 기간';
export const BANNER_START_DATE = '06/01(월)';
export const BANNER_END_DATE = '06/04(목)';

// admin 크롤러 — 이 시각 이전에는 계절 여석 크롤링, 이후에는 일반 여석 크롤링 토글을 표시
export const CRAWLER_SEASON_DATE = '2026-06-05T00:00:00+09:00';
