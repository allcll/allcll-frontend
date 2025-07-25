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

export interface Wishlist {
  baskets: Wishes[];
}

export interface Wishes {
  subjectId: number;
  subjectName: string;
  departmentName: string;
  departmentCode: string;
  subjectCode: string;
  classCode: string;
  professorName: string | null;
  totalCount: number;
}

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
  departmentName: string; // 학과명
  departmentCode: string; // 학과 코드
  subjectCode: string; // 과목코드
  classCode: string; // 분반
  professorName: string; // 교수명
  //새로 추가되는 필드
  language: string; // 수업 언어
  subjectType: string; // 수업 유형
  studentYear: number; // 학기
  lesn_time: string; // 수업 시간
  lesn_room: string; // 수업실
  tm_num: string; // 학점
}

export type SimulationStatusType = 'before' | 'start' | 'progress' | 'finish';

export interface DepartmentType {
  departmentCode: string;
  departmentName: string;
}

export type Grade = 1 | 2 | 3 | 4 | '전체';
export type Day = '월' | '화' | '수' | '목' | '금' | '토' | '일';
export const DAYS: Day[] = ['월', '화', '수', '목', '금', '토', '일'];
