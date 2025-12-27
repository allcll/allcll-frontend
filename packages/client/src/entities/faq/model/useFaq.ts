import { useQuery } from '@tanstack/react-query';
import { FaqAPIResponse, fetchFaq } from '../api/faq.ts';

export interface FaqElement {
  tag: string;
  question: string;
  answer: string;
}

function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: fetchFaq,
    staleTime: Infinity,
    select: (data: FaqAPIResponse) => data.faq.map((item, index) => ({ ...item, id: index })),
  });
}

export default useFaq;
