import useSubject from '@/entities/subjects/model/useSubject.ts';
import useDepartments, { Department } from '@/entities/departments/api/useDepartments.ts';
import { Subject } from '@/shared/model/types.ts';

export interface Lecture {
  subjectId: number;
  subjectCode: string;
  classCode: string;
  departmentName: string;
  subjectName: string;
  language: string;
  subjectType: string;
  semester_at: number;
  lesn_time: string;
  professorName: string;
  lesn_room: string;
  tm_num: string; // 서버에서 null일 수 있으면 ''로 정규화
}

export type UseLecturesReturn = {
  data: Lecture[];
  isLoading: boolean;
};

function useLectures(): UseLecturesReturn {
  const { data: subjects, isLoading: isLoadingSubjects } = useSubject();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();

  const isLoading = isLoadingSubjects || isLoadingDepartments;

  if (isLoading || !subjects || !departments) {
    return { data: [], isLoading };
  }

  const data: Lecture[] = getLectures(subjects, departments);
  return { data, isLoading: false };
}

function getLectures(subjects: Subject[], departments: Department[]): Lecture[] {
  return subjects.map((subject): Lecture => {
    const departmentFull = departments.find(dept => dept.departmentCode === subject.deptCd)?.departmentName || '';
    const departmentName = departmentFull ? departmentFull.split(' ').reverse()[0] : '';

    return {
      subjectId: subject.subjectId ?? -1,
      subjectCode: subject.subjectCode ?? '',
      classCode: subject.classCode ?? '',
      departmentName,
      subjectName: subject.subjectName ?? '',
      language: subject.curiLangNm ?? '',
      subjectType: subject.curiTypeCdNm ?? '',
      semester_at: subject.studentYear ? Number(subject.studentYear) : -1,
      lesn_time: subject.lesnTime ?? '',
      professorName: subject.professorName ?? '',
      lesn_room: subject.lesnRoom ?? '',
      tm_num: subject.tmNum ?? '', // null/undefined 방어
    };
  });
}

export default useLectures;
