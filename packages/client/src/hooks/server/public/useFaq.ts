import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnPublic } from '@/utils/api.ts';

export interface FaqElement {
  question: string;
  answer: string;
}

interface FaqAPIResponse {
  faq: FaqElement[];
}

function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: fetchFaq,
    staleTime: Infinity,
    select: (data: FaqAPIResponse) => data.faq,
  });
}

const fetchFaq = async () => {
  return await fetchJsonOnPublic<FaqAPIResponse>('/faq.json');
};

export default useFaq;
