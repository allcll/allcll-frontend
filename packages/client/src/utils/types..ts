export interface Subject {
  classCode: string; // 분반
  professorName: string; // 교수명
  subjectCode: string; // 과목코드
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
}

export interface SubjectList {
  data: Subject[];
}

export interface PinnedSeats {
  subjectId: number;
  seat: number;
  queryTime: string;
}

export interface Wishlist {
  Baskets: Wishes[];
}

interface Wishes {
  subjectId: number;
  subjectName: string;
  departmentName: string;
  departmentCode: string;
  subjectCode: string;
  classCode: string;
  professorName: string;
  totalCount: number;
  DepartmentRegisters: WishRegister[];
}

interface WishRegister {
  subjectId: number;
  departmentCode: string;
  classCode: string;
}