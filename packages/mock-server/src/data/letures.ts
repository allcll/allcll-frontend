import lectures from '../../../client/public/lectures.json';

export interface ISubjects {
  subjects: subject[];
}

interface subject {
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
  semester_at: number; // 학기
  lesn_time: string; // 수업 시간
  lesn_room: string; // 수업실
  tm_num: string; // 학점
}

export const subjects = lectures.subjects;

export function getSubjectById(subjectId: number) {
  return subjects.find(subject => subject.subjectId === subjectId);
}
