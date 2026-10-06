import { Subject } from '@/shared/model/types.ts';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { fetchSubjects, fetchSubjectsBySemester, SubjectResponse } from '@/entities/subjects/api/subjects.ts';
import { RECENT_SEMESTERS } from '@/entities/semester/api/semester';

export const InitSubject: Subject = {
  subjectId: -1,
  subjectName: '',
  subjectCode: '',
  classCode: '',
  professorName: '',
  deptCd: '',
  manageDeptNm: '',
  studentYear: '',
  lesnTime: '', // 수업 시간
  lesnRoom: '', // 강의실
  tmNum: '', // 학점
  remark: null, // 비고
  curiTypeCdNm: '', // 수업 유형 코드명 ('공필'/'전필'/'전선' 등)
  curiLangNm: null, // 수업 언어 코드명 ('한국어'/'영어' 등)
  isDeleted: true, // 삭제 여부
};

function useSubject(semester?: string) {
  semester = semester ?? RECENT_SEMESTERS.semesterCode;
  const isLatest = semester === RECENT_SEMESTERS.semesterCode;

  return useQuery({
    queryKey: ['subjects', semester],

    queryFn: () => (isLatest ? fetchSubjects() : fetchSubjectsBySemester(semester!)),

    staleTime: Infinity,

    select: data => data.subjectResponses,
  });
}

export function getSubjects(queryClient: QueryClient) {
  return queryClient.getQueryData<SubjectResponse>(['subjects', RECENT_SEMESTERS.semesterCode])?.subjectResponses ?? [];
}

export default useSubject;
