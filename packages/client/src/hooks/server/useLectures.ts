import useSubject from '@/hooks/server/useSubject.ts';
import useDepartments, { Department } from '@/hooks/server/useDepartments.ts';
import { Subject } from '@/utils/types.ts';

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
  tm_num: string;
}

function useLectures() {
  const { data: subjects } = useSubject();
  const { data: departments } = useDepartments();

  const getLectures = (subjects?: Subject[], departments?: Department[]): Lecture[] => {
    if (!subjects || !departments) {
      return [];
    }

    return subjects.map(subject => {
      const department = departments.find(dept => dept.departmentCode === subject.deptCd)?.departmentName || '';
      const departmentName = department ? department.split(' ').reverse()[0] : '';

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
        tm_num: subject.tmNum ?? '',
      };
    });
  };

  return getLectures(subjects, departments);
}

export default useLectures;
