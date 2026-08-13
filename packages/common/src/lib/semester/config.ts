/**
 * 학기 설정 모음 (client/admin 공용)
 * 학기 롤오버 시 이 파일의 값을 수정합니다.
 * client/admin 양쪽에서 import 하므로 React/Vite(import.meta.env) 의존을 두지 않습니다.
 * 서비스별 운영 기간은 operation-period API 로 관리하므로 여기서 다루지 않습니다.
 */

export interface ISemesterInfo {
  semesterCode: string;
  semesterValue: string;
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

// 메인 배너 수강신청 일정 표기 (날짜는 operation-period API 에서 구합니다)
export const BANNER_PERIOD_LABEL = '수강신청 기간';

// admin 크롤러 — 이 시각 이전에는 계절 여석 크롤링, 이후에는 일반 여석 크롤링 토글을 표시
export const CRAWLER_SEASON_DATE = '2026-06-05T00:00:00+09:00';
