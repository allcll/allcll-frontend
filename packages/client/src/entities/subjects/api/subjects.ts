import { Subject } from '@/utils/types.ts';
import { fetchJsonOnAPI } from '@/shared/api/api.ts';

export type SubjectResponse = {
  subjectResponses: Subject[];
};

export const fetchSubjects = async () => {
  return await fetchJsonOnAPI<SubjectResponse>('/api/subjects');
};
