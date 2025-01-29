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