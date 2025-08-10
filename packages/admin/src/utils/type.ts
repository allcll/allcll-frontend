export interface Session {
  tokenJ: string;
  tokenU: string;
  tokenR: string;
  tokenL: string;
}

export interface SubjectApiResponse {
  subjectId: number; // 과목 ID
  subjectName: string; // 과목명
  subjectCode: string; // 과목 코드
  classCode: string; // 분반
  professorName: string; // 교수명
  deptCd: string; // 학과 코드 (deptCd)
  manageDeptNm: string; // 학과명 (manageDeptNm)
  studentYear: string; // 수강 학년 (string → number로 변환 필요)
  lesnTime: string; // 수업 시간
  lesnRoom: string; // 수업실
  tmNum: string; // 학점 (tmNum)
  remark: string | null; // 비고
  curiTypeCdNm: string; // 수업 유형 코드명 ('공필'/'전필'/'전선' 등)
  curiLangNm: null | string; // 수업 언어 코드명 ('한국어'/'영어' 등)
  isDeleted: boolean; // 삭제 여부
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

export type Service = 'timetable' | 'baskets' | 'simulation' | 'live';

export interface PreiodService {
  id: Service;
  startDate: string;
  endDate: string;
  message: string;
}
