import { Filters } from '@/store/useFilterStore';

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

export interface Wishes extends Subject {
  departmentCode: string;
  departmentName: string;
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
}

export type SimulationStatusType = 'before' | 'start' | 'progress' | 'finish';

export interface DepartmentType {
  departmentCode: string;
  departmentName: string;
}

export interface RangeFilter {
  operator: 'over-equal' | 'under-equal';
  value: number;
}

export type RemarkType = '외국인대상' | 'SHP대상' | '기타';

export type Grade = 1 | 2 | 3 | 4;
export type Day = '월' | '화' | '수' | '목' | '금' | '토' | '일';
export const DAYS: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

export type Curitype = '교필' | '교선' | '전필' | '전선' | '전기' | '공필' | '균필' | '기필';
export type Credit = 1 | 2 | 3;

export interface FilterItemProps<VALUE extends string | number> {
  label: string;
  selected: boolean;
  onClick: () => void;
  value: VALUE;
}

export interface OptionType<VALUE extends string | number> {
  label: string;
  value: VALUE;
}

export interface FilterConfiguration<VALUE extends string | number> {
  filterKey: keyof Filters;
  options: OptionType<VALUE>[];
  label?: string;
  labelPrefix: string;
  default: boolean;
  ItemComponent: React.ComponentType<FilterItemProps<VALUE>>;
}
