// Fixme: 타입 도메인 별로 쪼개서 타입 각자 관리하기

export type With<T, K> = T & {
  [P in keyof K]?: K[P];
};

export interface PinnedSeats {
  subjectId: number;
  seatCount: number;
  queryTime: string;
}

export interface NonMajorSeats {
  subjectId: number;
  seatCount: number;
  queryTime: string;
}

export interface WishesOptions {
  departmentCode: string;
  departmentName: string;
  totalCount: number;
}

export type Wishes = With<Subject, WishesOptions>;

export interface WishRegister {
  studentBelong: string | null;
  registerDepartment: string | null;
  eachCount: number | null;
}

export interface SimulationSubject {
  subjectId: number;
  subjectCode: string;
  classCode: string;
  departmentName: string;
  subjectName: string;
  language: string;
  subjectType: string;
  semester_at: number;
  lesn_time: string; // | null;
  professorName: string;
  lesn_room: string;
  tm_num: string;
}

export interface Subject {
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
  subjectCode: string; // 과목 코드
  classCode: string; // 분반
  professorName: string; // 교수명
  deptCd: string; // 학과 코드 (deptCd)
  manageDeptNm: string; // 학과명 (manageDeptNm)
  studentYear: string; // 수강 학년 (string → number로 변환 필요)
  lesnTime: string; // 수업 시간
  lesnRoom: string; // 강의실
  tmNum: string; // 학점 (tmNum)
  remark: string | null; // 비고
  curiTypeCdNm: string; // 수업 유형 코드명 ('공필'/'전필'/'전선' 등)
  curiLangNm: null | string; // 수업 언어 코드명 ('한국어'/'영어' 등)
  isDeleted: boolean; // 삭제 여부

  // Todo: 필드 추가 - deptCd, manageDeptNm -> departmentCode, departmentName 점진적 변경
  // departmentCode: string;
  // departmentName: string;
}

/** before: 튜토리얼 + 관심과목 선택
 * start: 시작 -> 대기 -> 과목 불러오기 전
 * progress: 과목 신청 프로세스
 * finish: 결과 모달 */
export type SimulationStatusType = 'before' | 'start' | 'progress' | 'finish';
