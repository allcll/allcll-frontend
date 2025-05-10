export interface Subject {
  classCode: string; // 분반
  professorName: string; // 교수명
  subjectCode: string; // 과목코드
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
}

export interface PinnedSeats {
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
  language: string | null;
  subjectType: string;
  semester_at: number;
  lesn_time: string | null;
  professorName: string | null;
  lesn_room: string | null;
}

export type SubjectStatusType = 'PROGRESS' | 'SUCCESS' | 'FAILED' | 'DOUBLED' | 'CAPTCHA_FAILED' | 'CANCELED';

export type SimulationStatusType = 'before' | 'process' | 'finish';
