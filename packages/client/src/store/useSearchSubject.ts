import { Subject } from '@/utils/types.ts';
import { useQuery } from '@tanstack/react-query';

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

  const response = await fetch(`/api/subjects?${query}`, {
    headers: {
      Cookie: `sessionId=${document.cookie.split('=')[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch pinned subjects');
  }
  return response.json();
};
