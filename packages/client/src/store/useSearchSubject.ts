import { Subject } from '@/utils/types.ts';
import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export function useSearchSubject(searchOption: SubjectOption) {
  return useQuery({
    queryKey: ['searchedSubjects', searchOption],
    queryFn: () => searchSubject(searchOption),
    select: data => data?.subjectResponses,
  });
}

interface SubjectResponse {
  subjectResponses: Subject[];
}

interface SubjectOption {
  subjectName?: string;
  subjectCode?: string;
  classCode?: string;
  subjectId?: number;
  professorName?: string;
}

const searchSubject = async (searchOption: SubjectOption): Promise<SubjectResponse> => {
  const query = Object.entries(searchOption)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return await fetchJsonOnAPI(`/api/subjects?${query}`);
};
