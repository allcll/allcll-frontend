import { fetchJsonOnAPI } from '@/utils/api';
import { SubjectApiResponse } from '@/utils/type';
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
    enabled: false, //  자동 요청을 비활성화
  });
}

export default useSubject;
