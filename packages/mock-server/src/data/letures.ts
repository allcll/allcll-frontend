import lectures from '../../public/subjects.json';

export interface ISubjects {
  subjects: Subject[];
}

interface Subject {
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
  language?: string;
  subjectType?: string;
  totalCount?: number;
}

export const subjects = lectures.subjectResponses;

export function getSubjectById(subjectId: number) {
  return subjects.find(subject => subject.subjectId === subjectId);
}
