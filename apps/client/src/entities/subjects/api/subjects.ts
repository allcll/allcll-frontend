import { Subject } from '@/shared/model/types.ts';
import { fetchJsonOnAPI, fetchJsonOnPublic } from '@/shared/api/api.ts';

export type SubjectResponse = {
  subjectResponses: Subject[];
};

export const fetchSubjects = async () => {
  return await fetchJsonOnAPI<SubjectResponse>('/api/subjects');
};

export const fetchSubjectsBySemester = async (semester: string) => {
  return await fetchJsonOnPublic<SubjectResponse>(`/${semester}/subjects.json`);
};
