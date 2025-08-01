import { fetchJsonOnAPI } from '@/utils/api';
import { SubjectApiResponse } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

type SubjectResponse = {
  subjectResponses: SubjectApiResponse[];
};

const fetchSubjects = async () => {
  return await fetchJsonOnAPI<SubjectResponse>('/api/subjects');
};

function useSubject() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    staleTime: Infinity,
    select: data => data.subjectResponses,
  });
}

export default useSubject;
